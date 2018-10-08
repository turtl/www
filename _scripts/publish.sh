#!/bin/bash

DEST=$1


if [ "$DEST" == "" ]; then
	echo "Usage: $0 <destination>"
	echo ""
	echo "  Example $0 jo@mama.com:/tmp/turtl-site"
	exit 1
fi

rsync \
	-avz \
	--delete \
	--no-perms --no-owner --no-group \
	--delete \
	--delete-excluded \
	--filter 'protect .well-known' \
	--checksum \
	_site/ \
	${DEST}

