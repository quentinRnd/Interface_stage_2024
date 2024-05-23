#!/bin/bash
# Go to the script folder
cd "$(dirname "$0")"

# Get the app environment variables
source .env


rm -rf $THIRD_PARTY_REP/$NAME_CSP_REP
