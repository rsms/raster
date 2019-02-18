#!/bin/bash -e
cd "$(dirname "$0")/.."

VERSION=$(ruby <<SRC
require 'yaml'
print YAML.load_file('_data/info.yml')['version']
SRC
)

echo "Running misc/update-grid.css.sh"
./misc/update-grid.css.sh

echo "Building v${VERSION} -> _build/raster-${VERSION}.zip"

if [ -f _build/raster-${VERSION}.zip ]; then
  echo "_build/raster-${VERSION}.zip already exists" >&2
  exit 1
fi

cp misc/_config.yml _config.yml
jekyll build > /dev/null

rm -rf _build/raster
mkdir -p _build/raster
cp _site/example.html _site/example.css _site/grid.css _build/raster/
cp LICENSE.txt _build/raster/

cd _build/raster
zip -q -X -r ../raster-${VERSION}.zip *
cd ../..

echo "————————————————————————————————————————————————————————"
echo ""
echo "Next steps:"
echo ""
echo "1) Create new release with _build/raster-${VERSION}.zip"
echo "   https://github.com/rsms/raster/releases/new?tag=v${VERSION}"
echo ""
echo "2) Commit & push changes"
echo ""
echo "————————————————————————————————————————————————————————"
