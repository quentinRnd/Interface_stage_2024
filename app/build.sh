#!/bin/bash
# Build the app
# Build from container by default
# Argument 'host' allow to build from host



# Strict mode
set -o errexit -o nounset -o pipefail
IFS=$'\n\t'

# Go to the script folder
cd "$(dirname "$0")"

# Get the app environment variables
source .env
#import the GitHub projet witch contains the csp programme
if [ ! -d $THIRD_PARTY_REP/$NAME_CSP_REP ]; then
    mkdir -p $THIRD_PARTY_REP/$NAME_CSP_REP
	cd $THIRD_PARTY_REP/$NAME_CSP_REP
	git clone git@github.com:quentinRnd/Stage_Fac_2024.git
	cd ../..
fi

# Initialize conan home
CONAN_HOME="${PWD}/${CONAN_PATH}"
if [ ! -f "${CONAN_HOME}/profiles/default" ]
then
	export CONAN_HOME
	conan profile detect
fi

# Get conan ctl
DROGON_CTL="$(find "${CONAN_HOME}" -path '*/bin/drogon_ctl')"

# Remove previous build
rm -rf build

# Configure and build app
cmake -S . -B build -G Ninja -D CMAKE_BUILD_TYPE=${BUILD_TYPE} -D CONAN_HOME=${CONAN_HOME} -D DROGON_CTL=${DROGON_CTL}
cmake --build build