#!/bin/bash

# Translation validation script
# Compares a translation file against the source messages.json to find missing keys

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default paths
SOURCE_FILE="src/lib/i18n/messages.json"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Function to show usage
show_usage() {
    echo "Usage: $0 [LANGUAGE_FILE]"
    echo ""
    echo "Validates a translation file against the source messages.json"
    echo ""
    echo "Arguments:"
    echo "  LANGUAGE_FILE    Path to the translation file to validate (e.g., src/lib/i18n/it.json)"
    echo ""
    echo "Examples:"
    echo "  $0 src/lib/i18n/it.json"
    echo "  $0 src/lib/i18n/fr.json"
    echo ""
    echo "If no file is provided, it will check all .json files in src/lib/i18n/ except messages.json"
}

# Function to get all keys from a JSON file recursively
get_keys() {
    local file="$1"
    local prefix="$2"

    # Use jq to extract all keys recursively
    jq -r 'paths(scalars) as $p | $p | join(".")' "$file" | while read -r key; do
        if [ -n "$prefix" ]; then
            echo "${prefix}.${key}"
        else
            echo "$key"
        fi
    done
}

# Function to validate a single translation file
validate_file() {
    local translation_file="$1"
    local source_file="$2"

    echo -e "${YELLOW}Validating: $translation_file${NC}"
    echo "----------------------------------------"

    # Check if files exist
    if [ ! -f "$source_file" ]; then
        echo -e "${RED}Error: Source file $source_file not found${NC}"
        return 1
    fi

    if [ ! -f "$translation_file" ]; then
        echo -e "${RED}Error: Translation file $translation_file not found${NC}"
        return 1
    fi

    # Get all keys from source file
    local source_keys
    source_keys=$(get_keys "$source_file")

    # Get all keys from translation file
    local translation_keys
    translation_keys=$(get_keys "$translation_file")

    # Find missing keys
    local missing_keys
    missing_keys=$(comm -23 <(echo "$source_keys" | sort) <(echo "$translation_keys" | sort))

    # Find extra keys (in translation but not in source)
    local extra_keys
    extra_keys=$(comm -13 <(echo "$source_keys" | sort) <(echo "$translation_keys" | sort))

    # Count missing and extra keys
    local missing_count
    if [ -z "$missing_keys" ]; then
        missing_count=0
    else
        missing_count=$(echo "$missing_keys" | wc -l | tr -d ' ')
    fi

    local extra_count
    if [ -z "$extra_keys" ]; then
        extra_count=0
    else
        extra_count=$(echo "$extra_keys" | wc -l | tr -d ' ')
    fi

    # Report results
    if [ "$missing_count" -eq 0 ] && [ "$extra_count" -eq 0 ]; then
        echo -e "${GREEN} Perfect! All keys match.${NC}"
        return 0
    fi

    if [ "$missing_count" -gt 0 ]; then
        echo -e "${RED} Missing $missing_count key(s) in translation:${NC}"
        echo "$missing_keys" | while read -r key; do
            echo -e "  ${RED}• $key${NC}"
        done
        echo ""
    fi

    if [ "$extra_count" -gt 0 ]; then
        echo -e "${YELLOW}  Extra $extra_count key(s) in translation (not in source):${NC}"
        echo "$extra_keys" | while read -r key; do
            echo -e "  ${YELLOW}• $key${NC}"
        done
        echo ""
    fi

    # Return error code if there are missing keys
    if [ "$missing_count" -gt 0 ]; then
        return 1
    fi

    return 0
}

# Main function
main() {
    local translation_file="$1"
    local source_file="$PROJECT_ROOT/$SOURCE_FILE"
    local exit_code=0

    # Change to project root directory
    cd "$PROJECT_ROOT"

    # If no file specified, check all translation files
    if [ -z "$translation_file" ]; then
        echo -e "${YELLOW}No file specified. Checking all translation files...${NC}"
        echo ""

        # Find all .json files in i18n directory except messages.json
        local files
        files=$(find src/lib/i18n -name "*.json" -not -name "messages.json" 2>/dev/null || true)

        if [ -z "$files" ]; then
            echo -e "${YELLOW}No translation files found in src/lib/i18n/${NC}"
            return 0
        fi

        # Validate each file
        echo "$files" | while read -r file; do
            if [ -n "$file" ]; then
                if ! validate_file "$file" "$source_file"; then
                    exit_code=1
                fi
                echo ""
            fi
        done

        return $exit_code
    fi

    # Validate the specified file
    if ! validate_file "$translation_file" "$source_file"; then
        exit_code=1
    fi

    return $exit_code
}

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo -e "${RED}Error: jq is required but not installed.${NC}"
    echo "Please install jq:"
    echo "  macOS: brew install jq"
    echo "  Ubuntu/Debian: sudo apt-get install jq"
    echo "  CentOS/RHEL: sudo yum install jq"
    exit 1
fi

# Handle help flag
if [ "$1" = "-h" ] || [ "$1" = "--help" ]; then
    show_usage
    exit 0
fi

# Run main function
main "$1"
