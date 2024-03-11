#!/bin/bash
# Build the Podman image in rootless mode

# Strict mode
set -o errexit -o nounset -o pipefail
IFS=$'\n\t'

if [ $USER = root ]
then
	>&2 echo 'You cannot be root (rootless podman build)'
	exit 1
fi

# Go to the project folder
cd "$(dirname "$0")/.."

# Get the app environment variables
source app/.env

# Delete past images if they exists
PAST_IMAGES="$(podman images --all | (grep "$APP_NAME" || true) | awk '{ print $3 }')"
if [ -n "$PAST_IMAGES" ]
then
	# Kill any runing container decendent from $APP_NAME image
	# Else, run fail to kill running container from past image
	PAST_CONTAINERS="$(podman container list --quiet --filter ancestor=$APP_NAME)"
	if [ -n "$PAST_CONTAINERS" ]
	then
		podman container kill "$PAST_CONTAINERS"
	fi

	podman image rm --force "$PAST_IMAGES"
fi

# Get back ownership on mounted volume
function before_exit {
	podman unshare chown --recursive 0:0 $PWD/env/build
	podman unshare chown --recursive 0:0 $PWD/app
}
trap before_exit EXIT

# Build the base Podman image:
# - Name the image $APP_NAME (--tag)
# - Send informations to the Containerfile (--build-arg)
# - Link files between the host and the container (--volume)
# - Set the Containerfile location (--file)
# - Use the current directory as build context
podman image build \
	--tag $APP_NAME \
	--build-arg UID=$(id --user $USER) \
	--volume "$PWD/env/build:/media/user/build:U" \
	--volume "$PWD/app:/media/user/app:U" \
	--file env/Containerfile \
	.