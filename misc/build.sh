#!/bin/bash -e
cd "$(dirname "$0")/.."

opt_usage=false
postcss_args=()
opt_watch=false
DEBUG=0

while [[ $# -gt 0 ]]; do case $1 in
  -h|-help|--help)
    opt_usage=true
  ;;
  -g)
    DEBUG=1
  ;;
  -w|--watch)
    opt_watch=true
    postcss_args+=( --watch )
  ;;
  *)
    postcss_args+=( $1 )
  ;;
esac; shift; done


if $opt_usage; then
  echo "Builds $(basename "$PWD")" >&2
  echo "Usage: $0 [options]" >&2
  echo "" >&2
  echo "Options:" >&2
  echo "  -h           Show help and exit." >&2
  echo "  -g           Debug mode. Do not minify; create source map." >&2
  echo "  -w, --watch  Watch sources for changes and rebuild automatically." >&2
  echo "" >&2
  exit 1
fi

VERSION=$(ruby <<SRC
require 'yaml'
print YAML.load_file('_data/info.yml')['version']
SRC
)

if [ "$DEBUG" = "0" ]; then
  postcss_args+=( --no-map )
fi

node res/generate-grid.js 30 -version "${VERSION}" > src/grid.css

RASTER_VERSION="$VERSION (release package)" RASTER_DEBUG=$DEBUG ./node_modules/.bin/postcss \
  --config misc/postcss.config.js \
  ${postcss_args[@]} \
  -o raster.css \
  src/raster.css &

RASTER_VERSION="$VERSION (grid only)" RASTER_DEBUG=$DEBUG ./node_modules/.bin/postcss \
  --config misc/postcss.config.js \
  ${postcss_args[@]} \
  -o raster.grid.css \
  src/grid.css &

RASTER_VERSION="$VERSION (debugging helper extras)" RASTER_DEBUG=$DEBUG ./node_modules/.bin/postcss \
  --config misc/postcss.config.js \
  ${postcss_args[@]} \
  -o raster.debug.css \
  src/debug.css &

# when building a release build, also build a "debug" product
if [ "$DEBUG" = "0" ]; then
  RASTER_VERSION="$VERSION (dev package)" RASTER_DEBUG=1 ./node_modules/.bin/postcss \
    --config misc/postcss.config.js \
    -o raster.dev.css \
    src/raster.css &
else
  wait
  cp -a raster.debug.css raster.dev.css
fi

wait
