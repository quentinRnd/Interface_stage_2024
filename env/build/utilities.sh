#!/bin/bash
# Install utilities

# Strict mode
set -o errexit -o nounset -o pipefail
IFS=$'\n\t'

# Set Bash promt
cat /media/user/build/include/prompt.sh >> ~/.bashrc

# Install useful packages
sudo apt-get install --yes vim man git