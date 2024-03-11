#!/bin/bash
# build and execute the app

# Strict mode
set -o errexit -o nounset -o pipefail
IFS=$'\n\t'

# Go to the script folder
cd "$(dirname "$0")"

# Build and execute
./build.sh
./execute.sh