#!/bin/bash
# Execute the app

# Strict mode
set -o errexit -o nounset -o pipefail
IFS=$'\n\t'

# Go to the script folder
cd "$(dirname "$0")"

# Get the app environment variables
source .env

# Execute the app on the internal port
export INTERNAL_PORT
./build/${APP_NAME}