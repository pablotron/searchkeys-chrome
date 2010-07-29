#!/bin/sh

if [ "x$1" = 'x' ]; then
  echo "Usage: $0 <version>"
  exit -1
fi

dst=~/src/releases/searchkeys-chrome-"$1"
echo "building $dest"
exec hg archive -r "$1" "$dst"
