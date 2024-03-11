#!/bin/bash
# Test load sending many concurent HTTP requests
# Examples:
# - ./load.sh --method all --clients 10 --url 0.0.0.0:8080
# - ./load.sh --method --clients 10 --url https://etud-kvm-viallard.leria-etud.univ-angers.fr

# Strict mode
set -o errexit -o nounset -o pipefail
IFS=$'\n\t'

function help
{
	echo "Usage: $0 --method <get|post|all> --clients <integer> --url <URL>" 1>&2
	exit 1
}

# Transform long options to short ones
for arg in "$@"; do
	shift
	case "$arg" in
		'--method')		set -- "$@" '-m' ;;
		'--clients')	set -- "$@" '-c' ;;
		'--url')		set -- "$@" '-u' ;;
		*)				set -- "$@" "$arg"
	esac
done

# Parse short options
OPTIND=1
while getopts ":m:c:u:" opt; do
	case "$opt" in		
		m)
			if echo 'get post all' | grep --word-regexp --quiet "$OPTARG"
			then
				method="$OPTARG"
			else
				help
			fi
		;;

		c)
			clients="$OPTARG"
		;;

		u)
			url="$OPTARG"
		;;

		*)
			help
		;;
	esac
done
shift $((OPTIND-1))

if [[ ! -v method || ! -v clients || ! -v url ]]
then
	help
fi

function test
{
	if echo 'get all' | grep --word-regexp --quiet "$method"
	then
		echo "@$1: GET $url"
		curl -I \
			--request GET \
			--cookie JSESSIONID=$1 \
			--url $url \
			2> /dev/null | head -1
	fi

	if echo 'post all' | grep --word-regexp --quiet "$method"
	then
		echo "@$1: POST $url"
		curl \
			--request POST \
			--cookie JSESSIONID=$1 \
			--url $url/upload_session \
			--header 'Content-Type: multipart/form-data' \
			--form 'ajax_request=true' \
			--form 'file=@prime_session.json'
			> /dev/null
	fi	
}

# Send many concurent HTTP requests and store pids
for client in $(seq 1 $clients)
do
	test $client &
	pids[$client]=$!
done

# Wait for all requests to end
for pid in ${pids[*]}
do
    wait $pid
done