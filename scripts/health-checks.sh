#!/bin/bash
#
# Health check script for Asper Beauty Shop
# Runs automated health checks including:
#   - Build verification
#   - Lint checks
#   - Edge Function connectivity (optional)
#   - Frontend URL checks
#
# Usage: ./scripts/health-checks.sh

set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
GRAY='\033[0;90m'
NC='\033[0m' # No Color

# Output functions
write_success() { echo -e "${GREEN}✓ $1${NC}"; }
write_error() { echo -e "${RED}✗ $1${NC}"; }
write_info() { echo -e "${CYAN}ℹ $1${NC}"; }
write_warning() { echo -e "${YELLOW}⚠ $1${NC}"; }

# Initialize counters
PASSED=0
FAILED=0
WARNINGS=0

echo -e "${MAGENTA}"
echo "╔════════════════════════════════════════════════╗"
echo "║   Asper Beauty Shop - Health Check Suite      ║"
echo "╚════════════════════════════════════════════════╝"
echo -e "${NC}"

# Get project root (assuming script is in /scripts)
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"

# Change to project directory
cd "$PROJECT_ROOT"

# ═══════════════════════════════════════════════════════
# 1. Environment Check
# ═══════════════════════════════════════════════════════
write_info "Checking environment..."

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    write_success "Node.js installed: $NODE_VERSION"
    ((PASSED++))
else
    write_error "Node.js not found. Please install Node.js 18+"
    ((FAILED++))
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    write_success "npm installed: v$NPM_VERSION"
    ((PASSED++))
else
    write_error "npm not found"
    ((FAILED++))
fi

# Check if node_modules exists
if [ -d "node_modules" ]; then
    write_success "Dependencies installed"
    ((PASSED++))
else
    write_warning "node_modules not found. Run 'npm install'"
    ((WARNINGS++))
fi

echo ""

# ═══════════════════════════════════════════════════════
# 2. Lint Check
# ═══════════════════════════════════════════════════════
write_info "Running linter..."

if npm run lint > /tmp/lint.log 2>&1; then
    write_success "Lint check passed"
    ((PASSED++))
else
    write_error "Lint check failed"
    echo -e "${GRAY}$(cat /tmp/lint.log)${NC}"
    ((FAILED++))
fi

echo ""

# ═══════════════════════════════════════════════════════
# 3. TypeScript Check
# ═══════════════════════════════════════════════════════
write_info "Checking TypeScript compilation..."

if command -v npx &> /dev/null; then
    if npx tsc --noEmit > /tmp/tsc.log 2>&1; then
        write_success "TypeScript compilation passed"
        ((PASSED++))
    else
        write_error "TypeScript compilation failed"
        echo -e "${GRAY}$(cat /tmp/tsc.log)${NC}"
        ((FAILED++))
    fi
else
    write_warning "npx not available, skipping TypeScript check"
    ((WARNINGS++))
fi

echo ""

# ═══════════════════════════════════════════════════════
# 4. Build Check
# ═══════════════════════════════════════════════════════
write_info "Testing production build..."

if npm run build > /tmp/build.log 2>&1; then
    write_success "Build succeeded"
    ((PASSED++))
    
    # Check if dist directory was created
    if [ -d "dist" ]; then
        write_success "Build artifacts created in dist/"
        ((PASSED++))
    else
        write_warning "dist/ directory not found after build"
        ((WARNINGS++))
    fi
else
    write_error "Build failed"
    echo -e "${GRAY}$(cat /tmp/build.log)${NC}"
    ((FAILED++))
fi

echo ""

# ═══════════════════════════════════════════════════════
# 5. Environment Variables Check
# ═══════════════════════════════════════════════════════
write_info "Checking environment variables..."

if [ -f ".env" ]; then
    write_success ".env file exists"
    ((PASSED++))
    
    # Check for critical variables
    REQUIRED_VARS=(
        "VITE_SUPABASE_URL"
        "VITE_SUPABASE_PUBLISHABLE_KEY"
        "VITE_SHOPIFY_STORE"
        "VITE_SHOPIFY_STOREFRONT_TOKEN"
    )
    
    for var in "${REQUIRED_VARS[@]}"; do
        if grep -q "^${var}=" .env; then
            write_success "$var is set"
            ((PASSED++))
        else
            write_warning "$var not found in .env"
            ((WARNINGS++))
        fi
    done
else
    write_warning ".env file not found"
    ((WARNINGS++))
fi

echo ""

# ═══════════════════════════════════════════════════════
# 6. Frontend URL Check (Optional)
# ═══════════════════════════════════════════════════════
write_info "Checking frontend URL (optional)..."

FRONTEND_URL="https://asperbeautyshop.lovable.app"
if command -v curl &> /dev/null; then
    HTTP_CODE=$(curl -o /dev/null -s -w "%{http_code}" --connect-timeout 10 "$FRONTEND_URL" || echo "000")
    if [ "$HTTP_CODE" = "200" ]; then
        write_success "Frontend is accessible: $FRONTEND_URL"
        ((PASSED++))
    elif [ "$HTTP_CODE" = "000" ]; then
        write_warning "Could not reach frontend URL (may be expected in local/offline environment)"
        ((WARNINGS++))
    else
        write_warning "Frontend returned status code: $HTTP_CODE"
        ((WARNINGS++))
    fi
else
    write_warning "curl not available, skipping frontend check"
    ((WARNINGS++))
fi

echo ""

# ═══════════════════════════════════════════════════════
# 7. Edge Function Check (Optional)
# ═══════════════════════════════════════════════════════
write_info "Checking Edge Function (optional)..."

if [ -f ".env" ]; then
    # Extract anon key from .env
    ANON_KEY=$(grep "VITE_SUPABASE_PUBLISHABLE_KEY=" .env | cut -d '=' -f 2- | tr -d '"' | tr -d "'")
    
    if [ -n "$ANON_KEY" ] && command -v curl &> /dev/null; then
        EDGE_URL="https://rgehleqcubtmcwyipyvi.supabase.co/functions/v1/beauty-assistant"
        HTTP_CODE=$(curl -o /dev/null -s -w "%{http_code}" \
            --connect-timeout 10 \
            -X POST "$EDGE_URL" \
            -H "Authorization: Bearer $ANON_KEY" \
            -H "Content-Type: application/json" \
            -d '{"message":"health check"}' || echo "000")
        
        if [ "$HTTP_CODE" = "200" ]; then
            write_success "Beauty Assistant Edge Function is responding"
            ((PASSED++))
        else
            write_warning "Beauty Assistant Edge Function not reachable (may be expected if not deployed)"
            [ "$HTTP_CODE" != "000" ] && echo -e "${GRAY}  Status code: $HTTP_CODE${NC}"
            ((WARNINGS++))
        fi
    else
        write_warning "Supabase anon key not found or curl not available, skipping Edge Function check"
        ((WARNINGS++))
    fi
else
    write_warning ".env not found, skipping Edge Function check"
    ((WARNINGS++))
fi

echo ""

# ═══════════════════════════════════════════════════════
# 8. Git Status Check
# ═══════════════════════════════════════════════════════
write_info "Checking Git status..."

if command -v git &> /dev/null; then
    if git rev-parse --git-dir > /dev/null 2>&1; then
        GIT_STATUS=$(git status --porcelain 2>&1)
        if [ -z "$GIT_STATUS" ]; then
            write_success "Working directory is clean"
            ((PASSED++))
        else
            write_warning "Uncommitted changes detected"
            ((WARNINGS++))
        fi
    else
        write_warning "Not a git repository"
        ((WARNINGS++))
    fi
else
    write_warning "Git not installed"
    ((WARNINGS++))
fi

echo ""

# ═══════════════════════════════════════════════════════
# Summary
# ═══════════════════════════════════════════════════════
echo -e "${MAGENTA}"
echo "╔════════════════════════════════════════════════╗"
echo "║              Health Check Summary              ║"
echo "╚════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""
echo -e "  ${GREEN}Passed:   $PASSED${NC}"
echo -e "  ${RED}Failed:   $FAILED${NC}"
echo -e "  ${YELLOW}Warnings: $WARNINGS${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    write_success "All critical checks passed! ✓"
    echo ""
    if [ $WARNINGS -gt 0 ]; then
        write_warning "Note: Some optional checks produced warnings. Review above."
    fi
    exit 0
else
    write_error "Some critical checks failed. Please fix issues above."
    echo ""
    exit 1
fi
