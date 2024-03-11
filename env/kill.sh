#!/bin/bash
# Kill app process if it is still running

# Strict mode
set -o errexit -o nounset -o pipefail
IFS=$'\n\t'

# Go to the project folder
cd "$(dirname "$0")/.."

# Get the app environment variables
source app/.env

if pgrep $APP_NAME
then
	pkill -SIGKILL $APP_NAME
fi