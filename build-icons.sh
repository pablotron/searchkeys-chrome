#!/bin/sh

inkscape -D -e logo.{png,svg}

for i in 16 32 48 128; do 
  out=icons/$i.png

  echo "creating $out"
  convert -antialias -scale $i'x'$i logo.png $out
done
