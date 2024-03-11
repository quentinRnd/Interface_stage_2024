#!/bin/bash
# Initialize the image

# Strict mode
set -o errexit -o nounset -o pipefail 
IFS=$'\n\t'

# Set the hostname
echo "127.0.0.1 ${HOSTNAME}" >> /etc/hosts

# Set the correct timezone
ln --symbolic --force /usr/share/zoneinfo/Europe/Paris /etc/localtime

# Create app user
useradd user --uid $1 --create-home --shell /bin/bash
usermod --append --groups sudo user
passwd --delete user

# Update software repositories and install sudo
apt-get update
apt-get install --yes sudo