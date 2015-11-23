#!/bin/bash

DEST=$1


if [ "$DEST" == "" ]; then
	echo "Usage: $0 <destination>"
	echo ""
	echo "  Example $0 jo@mama.com:/tmp/turtl-site"
fi

rsync \
	-avz \
	--delete \
	--checksum \
	_site/ \
	${DEST}

