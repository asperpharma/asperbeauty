#!/bin/bash

# Supabase Deployment Script
# This script deploys migrations and edge functions to Supabase
# Usage: 
#   export SUPABASE_ACCESS_TOKEN=your-token
#   ./scripts/deploy-supabase.sh

set -e  # Exit on error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ID="rgehleqcubtmcwyipyvi"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
SUPABASE_DIR="$PROJECT_ROOT/supabase"

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  Supabase Deployment Script${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Step 1: Validate SUPABASE_ACCESS_TOKEN
echo -e "${YELLOW}[1/5]${NC} Validating environment..."
if [ -z "$SUPABASE_ACCESS_TOKEN" ]; then
    echo -e "${RED}✗ Error: SUPABASE_ACCESS_TOKEN environment variable is not set${NC}"
    echo ""
    echo "Please set your Supabase access token:"
    echo "  export SUPABASE_ACCESS_TOKEN=your-token"
    echo ""
    echo "You can get your access token from:"
    echo "  https://supabase.com/dashboard/account/tokens"
    exit 1
fi
echo -e "${GREEN}✓ SUPABASE_ACCESS_TOKEN is set${NC}"

# Step 2: Check for Supabase CLI
echo ""
echo -e "${YELLOW}[2/5]${NC} Checking Supabase CLI..."
if ! command -v supabase &> /dev/null; then
    echo -e "${RED}✗ Error: Supabase CLI is not installed${NC}"
    echo ""
    echo "Please install the Supabase CLI:"
    echo "  macOS/Linux: brew install supabase/tap/supabase"
    echo "  npm: npm install -g supabase"
    echo ""
    echo "More info: https://supabase.com/docs/guides/cli/getting-started"
    exit 1
fi

SUPABASE_VERSION=$(supabase --version)
echo -e "${GREEN}✓ Supabase CLI installed ($SUPABASE_VERSION)${NC}"

# Step 3: Link to project
echo ""
echo -e "${YELLOW}[3/5]${NC} Linking to Supabase project..."
cd "$PROJECT_ROOT"

# Check if already linked
if [ -f "$SUPABASE_DIR/.temp/project-ref" ]; then
    CURRENT_PROJECT=$(cat "$SUPABASE_DIR/.temp/project-ref" 2>/dev/null || echo "")
    if [ "$CURRENT_PROJECT" = "$PROJECT_ID" ]; then
        echo -e "${GREEN}✓ Already linked to project $PROJECT_ID${NC}"
    else
        echo "Unlinking from current project..."
        supabase unlink
        echo "Linking to project $PROJECT_ID..."
        supabase link --project-ref "$PROJECT_ID"
        echo -e "${GREEN}✓ Linked to project $PROJECT_ID${NC}"
    fi
else
    echo "Linking to project $PROJECT_ID..."
    supabase link --project-ref "$PROJECT_ID"
    echo -e "${GREEN}✓ Linked to project $PROJECT_ID${NC}"
fi

# Step 4: Deploy migrations
echo ""
echo -e "${YELLOW}[4/5]${NC} Deploying database migrations..."
if [ -d "$SUPABASE_DIR/migrations" ] && [ "$(ls -A $SUPABASE_DIR/migrations)" ]; then
    MIGRATION_COUNT=$(ls -1 "$SUPABASE_DIR/migrations" | wc -l)
    echo "Found $MIGRATION_COUNT migration file(s)"
    
    supabase db push
    echo -e "${GREEN}✓ Database migrations deployed successfully${NC}"
else
    echo -e "${YELLOW}⚠ No migrations found in $SUPABASE_DIR/migrations${NC}"
fi

# Step 5: Deploy Edge Functions
echo ""
echo -e "${YELLOW}[5/5]${NC} Deploying Edge Functions..."
if [ -d "$SUPABASE_DIR/functions" ] && [ "$(ls -A $SUPABASE_DIR/functions)" ]; then
    FUNCTION_DIRS=$(find "$SUPABASE_DIR/functions" -mindepth 1 -maxdepth 1 -type d -not -name "_*" 2>/dev/null)
    FUNCTION_COUNT=$(echo "$FUNCTION_DIRS" | grep -c . || echo "0")
    
    if [ "$FUNCTION_COUNT" -gt 0 ]; then
        echo "Found $FUNCTION_COUNT Edge Function(s):"
        echo "$FUNCTION_DIRS" | while read -r func_dir; do
            func_name=$(basename "$func_dir")
            echo "  - $func_name"
        done
        echo ""
        
        # Deploy all functions
        supabase functions deploy
        echo -e "${GREEN}✓ Edge Functions deployed successfully${NC}"
    else
        echo -e "${YELLOW}⚠ No Edge Functions found in $SUPABASE_DIR/functions${NC}"
    fi
else
    echo -e "${YELLOW}⚠ Functions directory not found${NC}"
fi

# Success message
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✓ Deployment completed successfully!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Your Supabase project has been updated:"
echo "  Project ID: $PROJECT_ID"
echo "  Dashboard: https://supabase.com/dashboard/project/$PROJECT_ID"
echo ""
