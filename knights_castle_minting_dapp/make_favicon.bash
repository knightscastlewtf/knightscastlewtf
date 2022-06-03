#!/bin/bash

# from
# http://bergamini.org/computers/creating-favicon.ico-icon-files-with-imagemagick-convert.html

convert logo.png -resize 512x512 -transparent white favicon512.png
convert favicon512.png -resize 16x16 favicon16.png
convert favicon512.png -resize 32x32 favicon32.png
convert favicon512.png -resize 64x64 favicon64.png
convert favicon512.png -resize 128x128 favicon128.png
convert favicon512.png -resize 192x192 favicon192.png
convert favicon512.png -resize 256x256 favicon256.png
convert favicon16.png favicon32.png favicon64.png favicon128.png favicon192.png favicon256.png favicon512.png -colors 256 favicon.ico
