#!/bin/bash -e
cd "$(dirname "$0")/.."

VERSION=$(ruby <<SRC
require 'yaml'
print YAML.load_file('_data/info.yml')['version']
SRC
)

echo "Running misc/build.sh"
./misc/build.sh

echo "Building version ${VERSION} -> _build/raster-${VERSION}.zip"
if [ -f _build/raster-${VERSION}.zip ]; then
  echo "_build/raster-${VERSION}.zip already exists" >&2
  exit 1
fi

cp misc/_config.yml _config.yml
jekyll build > /dev/null

DST=_build/Raster
rm -rf $DST
mkdir -p $DST
cp LICENSE.txt \
   _site/raster.css \
   _site/raster.debug.css \
   _site/raster.grid.css \
   _site/template.html \
   $DST/
cp -R _site/examples $DST/examples

pushd $DST >/dev/null
zip -q -X -r "../Raster-v${VERSION}.zip" *
popd >/dev/null
rm -rf $DST

echo "————————————————————————————————————————————————————————"
echo ""
echo "Next steps:"
echo ""
echo "1) Create new release with _build/Raster-v${VERSION}.zip"
echo "   https://github.com/rsms/raster/releases/new?tag=v${VERSION}"
echo ""
echo "2) Commit & push changes"
echo ""
echo "————————————————————————————————————————————————————————"

if (which open >/dev/null); then
  open _build
fi
