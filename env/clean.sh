#!/bin/bash
# Clean repository and keep build folders

# Strict mode
set -o errexit -o nounset -o pipefail
IFS=$'\n\t'

# Go to the project folder
cd "$(dirname "$0")/.."

# Perform the cleaning
git clean -ffdxn | \
	cut --delimiter ' ' --fields 3- | \
	grep --invert-match --extended-regexp "app/conan/home/" | \
	grep --invert-match --extended-regexp "app/third-party/"| \
	xargs -I{} rm --recursive --force {}