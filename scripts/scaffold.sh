#!/bin/bash

# Template Scaffold Script
# Usage: ./scripts/scaffold.sh <type> <name>
# Example: ./scripts/scaffold.sh component ProductFilter

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Check arguments
if [ "$#" -lt 2 ]; then
    print_error "Usage: $0 <type> <name>"
    echo ""
    echo "Available types:"
    echo "  component    - React component"
    echo "  page         - Page component with routing"
    echo "  hook         - Custom React hook"
    echo "  store        - Zustand store"
    echo "  form         - Form with validation"
    echo "  utility      - Utility functions"
    echo ""
    echo "Examples:"
    echo "  $0 component ProductFilter"
    echo "  $0 page AboutUs"
    echo "  $0 hook useProductSearch"
    echo "  $0 store notificationStore"
    exit 1
fi

TYPE=$1
NAME=$2

# Determine template and output paths
case $TYPE in
    component)
        TEMPLATE=".templates/component.template.tsx"
        OUTPUT="src/components/${NAME}.tsx"
        PLACEHOLDER="ComponentName"
        ;;
    page)
        TEMPLATE=".templates/page.template.tsx"
        OUTPUT="src/pages/${NAME}.tsx"
        PLACEHOLDER="PageName"
        print_info "Remember to add route in App.tsx:"
        echo "  <Route path=\"/$(echo $NAME | sed 's/\([A-Z]\)/-\L\1/g' | sed 's/^-//')\" element={<${NAME} />} />"
        ;;
    hook)
        TEMPLATE=".templates/hook.template.ts"
        OUTPUT="src/hooks/${NAME}.ts"
        PLACEHOLDER="HookName"
        # Remove 'use' prefix if provided
        NAME_WITHOUT_USE=${NAME#use}
        PLACEHOLDER_WITHOUT_USE="HookName"
        ;;
    store)
        TEMPLATE=".templates/store.template.ts"
        OUTPUT="src/stores/${NAME}.ts"
        PLACEHOLDER="StoreName"
        ;;
    form)
        TEMPLATE=".templates/form.template.tsx"
        OUTPUT="src/components/${NAME}.tsx"
        PLACEHOLDER="FormName"
        ;;
    utility)
        TEMPLATE=".templates/utility.template.ts"
        OUTPUT="src/lib/${NAME}.ts"
        PLACEHOLDER="UtilityName"
        ;;
    *)
        print_error "Unknown type: $TYPE"
        echo "Available types: component, page, hook, store, form, utility"
        exit 1
        ;;
esac

# Check if template exists
if [ ! -f "$TEMPLATE" ]; then
    print_error "Template not found: $TEMPLATE"
    exit 1
fi

# Check if output file already exists
if [ -f "$OUTPUT" ]; then
    print_warning "File already exists: $OUTPUT"
    read -p "Overwrite? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_info "Cancelled."
        exit 0
    fi
fi

# Create output directory if it doesn't exist
OUTPUT_DIR=$(dirname "$OUTPUT")
if [ ! -d "$OUTPUT_DIR" ]; then
    mkdir -p "$OUTPUT_DIR"
    print_success "Created directory: $OUTPUT_DIR"
fi

# Copy template and replace placeholder
print_info "Creating $TYPE from template..."
cp "$TEMPLATE" "$OUTPUT"

# Replace placeholders in the file
if [ "$TYPE" = "hook" ]; then
    # Special handling for hooks - preserve 'use' prefix in hook name
    NAME_WITHOUT_USE=${NAME#use}
    sed -i "s/\[HookName\]/${NAME_WITHOUT_USE}/g" "$OUTPUT"
    sed -i "s/useHookName/${NAME}/g" "$OUTPUT"
else
    sed -i "s/\[${PLACEHOLDER}\]/${NAME}/g" "$OUTPUT"
    # Also replace any instances without brackets
    sed -i "s/${PLACEHOLDER}/${NAME}/g" "$OUTPUT"
fi

print_success "Created: $OUTPUT"

# Print next steps
echo ""
print_info "Next steps:"
case $TYPE in
    component)
        echo "  1. Open $OUTPUT"
        echo "  2. Update the props interface"
        echo "  3. Implement component logic"
        echo "  4. Import and use: import { ${NAME} } from \"@/components/${NAME}\""
        ;;
    page)
        echo "  1. Open $OUTPUT"
        echo "  2. Update SEO meta tags"
        echo "  3. Implement page sections"
        echo "  4. Add route in App.tsx"
        ;;
    hook)
        echo "  1. Open $OUTPUT"
        echo "  2. Update the hook parameters and return type"
        echo "  3. Implement hook logic"
        echo "  4. Use in components: const { data, isLoading } = ${NAME}(params)"
        ;;
    store)
        echo "  1. Open $OUTPUT"
        echo "  2. Update the store state interface"
        echo "  3. Implement store actions"
        echo "  4. Use in components: const { items, addItem } = ${NAME#Store}Store()"
        ;;
    form)
        echo "  1. Open $OUTPUT"
        echo "  2. Update the Zod schema"
        echo "  3. Update form fields"
        echo "  4. Use: <${NAME} onSubmit={handleSubmit} />"
        ;;
    utility)
        echo "  1. Open $OUTPUT"
        echo "  2. Add/remove utility functions as needed"
        echo "  3. Export functions"
        echo "  4. Import: import { functionName } from \"@/lib/${NAME}\""
        ;;
esac

echo ""
print_info "Don't forget to:"
echo "  • Run 'npm run build' to check for errors"
echo "  • Run 'npm run lint' to check code style"
echo "  • Test in both LTR and RTL modes"
echo "  • Test responsive behavior"

print_success "Done! Happy coding! 🚀"
