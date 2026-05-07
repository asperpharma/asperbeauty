#!/bin/bash
# Asper Beauty Shop - Health Check Script
# Purpose: Automated health checks for the system
# Run from project root: ./scripts/health-checks.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Options
SKIP_BUILD=false
SKIP_EDGE_FUNCTIONS=false
SUPABASE_URL="${SUPABASE_URL:-https://rgehleqcubtmcwyipyvi.supabase.co}"
ANON_KEY="${VITE_SUPABASE_ANON_KEY}"

# Counters
ERROR_COUNT=0
WARNING_COUNT=0

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --skip-build)
            SKIP_BUILD=true
            shift
            ;;
        --skip-edge-functions)
            SKIP_EDGE_FUNCTIONS=true
            shift
            ;;
        --supabase-url)
            SUPABASE_URL="$2"
            shift 2
            ;;
        --anon-key)
            ANON_KEY="$2"
            shift 2
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Logging functions
log_result() {
    local message=$1
    local status=${2:-INFO}
    
    case $status in
        PASS)
            echo -e "${GREEN}✓${NC} $message"
            ;;
        FAIL)
            echo -e "${RED}✗${NC} $message"
            ((ERROR_COUNT++))
            ;;
        WARN)
            echo -e "${YELLOW}⚠${NC} $message"
            ((WARNING_COUNT++))
            ;;
        INFO)
            echo -e "${CYAN}ℹ${NC} $message"
            ;;
    esac
}

echo -e "${CYAN}=====================================${NC}"
echo -e "${CYAN}Asper Beauty Shop - Health Checks${NC}"
echo -e "${CYAN}=====================================${NC}"
echo ""

# Check 1: Node.js version
echo -e "\n${NC}[1/6] Checking Node.js version...${NC}"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
    
    if [ "$MAJOR_VERSION" -ge 18 ]; then
        log_result "Node.js version: $NODE_VERSION" "PASS"
    else
        log_result "Node.js version $NODE_VERSION is too old (need 18+)" "FAIL"
    fi
else
    log_result "Node.js not found or not in PATH" "FAIL"
fi

# Check 2: Dependencies installed
echo -e "\n${NC}[2/6] Checking dependencies...${NC}"
if [ -d "node_modules" ]; then
    log_result "node_modules directory exists" "PASS"
else
    log_result "node_modules not found - run 'npm install'" "FAIL"
fi

# Check 3: Linting
echo -e "\n${NC}[3/6] Running ESLint...${NC}"
if npm run lint > /dev/null 2>&1; then
    log_result "Linting passed with no errors" "PASS"
else
    log_result "Linting failed - run 'npm run lint' for details" "FAIL"
fi

# Check 4: TypeScript compilation
echo -e "\n${NC}[4/6] Checking TypeScript...${NC}"
if npx tsc --noEmit > /dev/null 2>&1; then
    log_result "TypeScript compilation successful" "PASS"
else
    log_result "TypeScript errors found - run 'npx tsc --noEmit' for details" "WARN"
fi

# Check 5: Build
if [ "$SKIP_BUILD" = false ]; then
    echo -e "\n${NC}[5/6] Running production build...${NC}"
    if npm run build > /dev/null 2>&1; then
        log_result "Production build successful" "PASS"
        
        # Check dist folder
        if [ -d "dist" ]; then
            DIST_SIZE=$(du -sh dist | cut -f1)
            log_result "dist/ folder created ($DIST_SIZE)" "INFO"
        fi
    else
        log_result "Build failed - run 'npm run build' for details" "FAIL"
    fi
else
    echo -e "\n${NC}[5/6] Skipping build (--skip-build flag)${NC}"
fi

# Check 6: Edge Functions health
if [ "$SKIP_EDGE_FUNCTIONS" = false ]; then
    echo -e "\n${NC}[6/6] Checking Edge Functions...${NC}"
    
    if [ -z "$ANON_KEY" ]; then
        log_result "VITE_SUPABASE_ANON_KEY not set - skipping Edge Function checks" "WARN"
    else
        # Test beauty-assistant function
        RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
            "$SUPABASE_URL/functions/v1/beauty-assistant" \
            -H "Authorization: Bearer $ANON_KEY" \
            -H "Content-Type: application/json" \
            -d '{"message": "health check"}' \
            2>/dev/null)
        
        HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
        BODY=$(echo "$RESPONSE" | head -n-1)
        
        if [ "$HTTP_CODE" = "200" ]; then
            log_result "beauty-assistant function is responding" "PASS"
        elif [ "$HTTP_CODE" = "401" ]; then
            log_result "beauty-assistant function found but authentication failed" "WARN"
        else
            log_result "beauty-assistant function not reachable (HTTP $HTTP_CODE)" "FAIL"
        fi
    fi
else
    echo -e "\n${NC}[6/6] Skipping Edge Functions (--skip-edge-functions flag)${NC}"
fi

# Summary
echo -e "\n${CYAN}=====================================${NC}"
echo -e "${CYAN}Health Check Summary${NC}"
echo -e "${CYAN}=====================================${NC}"

if [ $ERROR_COUNT -eq 0 ] && [ $WARNING_COUNT -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed!${NC}"
    exit 0
elif [ $ERROR_COUNT -eq 0 ]; then
    echo -e "${YELLOW}⚠ Checks completed with $WARNING_COUNT warning(s)${NC}"
    exit 0
else
    echo -e "${RED}✗ Checks failed with $ERROR_COUNT error(s) and $WARNING_COUNT warning(s)${NC}"
    exit 1
fi
