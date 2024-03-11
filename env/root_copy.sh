#!/bin/bash
# Copy user app image to root storage

# Strict mode
set -o errexit -o nounset -o pipefail
IFS=$'\n\t'

# Go to the project folder
cd "$(dirname "$0")/.."

# Get the app environment variables
source app/.env

# User must have already built app image
if [ -z "$(podman images | (grep "$APP_NAME" || true) | awk '{ print $3 }')" ]
then
	>&2 echo 'User must have already built app image'
	exit 1
fi

# Perform the copy
podman image save $APP_NAME | sudo podman image load