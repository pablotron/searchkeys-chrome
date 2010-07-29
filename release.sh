#!/bin/sh

if [ "x$1" = 'x' ]; then
  echo "Usage: $0 <version>"
  exit -1
fi

dst=~/src/releases/searchkeys-chrome-"$1"

echo "building $dst"
hg archive -r "$1" "$dst"

echo "building $dst.zip"
exec hg archive -t zip -r "$1" "$dst.zip"
