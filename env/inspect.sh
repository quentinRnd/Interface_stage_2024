#!/bin/bash
# Inspect a running the Podman container

# Strict mode
set -o errexit -o nounset -o pipefail
IFS=$'\n\t'

# Go to the project folder
cd "$(dirname "$0")/.."

# Get the app environment variables
source app/.env

# Kill any runing container decendent from $APP_NAME image
PAST_CONTAINERS=$(podman container list --quiet --filter ancestor=$APP_NAME)
if [ -n "$PAST_CONTAINERS" ]
then
	podman container kill $PAST_CONTAINERS
fi

# Create and run a container
# - bind a container port with an host port (-p)
# - Map the host user id with the one used inside the container (--userns)
# - Link files between the host and the container (--volume)
# - Load an environment file (--env-file)
# - Interactive terminal (--interactive --tty)
# - The container is based on the latest $APP_NAME image
podman container run \
	-p $EXTERNAL_PORT:$INTERNAL_PORT \
	--userns keep-id \
	--volume "$PWD/app:/media/user/app" \
	--interactive --tty \
	$APP_NAME:latest