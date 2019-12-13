#!/bin/bash -e
cd "$(dirname "$0")/.."

BUILDDIR=_build

VERSION=$(ruby <<SRC
require 'yaml'
print YAML.load_file('_data/info.yml')['version']
SRC
)


# check for zip file -- only continue if not exists
ZIP=Raster-v${VERSION}.zip
echo "Building version ${VERSION} -> _build/$ZIP"
if [ -f "_build/$ZIP" ]; then
  echo "_build/$ZIP already exists. Update version in _data/info.yml" >&2
  exit 1
fi


# generate CSS
echo "Running misc/build.sh"
./misc/build.sh


# generate website
WEBDIR=$BUILDDIR/site
rm -rf "$WEBDIR"
mkdir -p "$WEBDIR"
cp misc/_config.yml "$WEBDIR/_config.yml"
jekyll build -d "$WEBDIR"  > /dev/null


# create zip file
DST="$BUILDDIR/Raster"
rm -rf "$DST"
mkdir -p "$DST"
cp LICENSE.txt \
   "$WEBDIR/raster.css" \
   "$WEBDIR/raster.debug.css" \
   "$WEBDIR/raster.grid.css" \
   "$WEBDIR/raster.dev.css" \
   "$WEBDIR/template.html" \
   "$DST/"
cp -R "$WEBDIR/examples" "$DST/examples"

pushd "$DST" >/dev/null
zip -q -X -r "../$ZIP" *
popd >/dev/null
rm -rf "$DST"


echo "————————————————————————————————————————————————————————"
echo ""
echo "Next steps:"
echo ""
echo "1) Create new release with _build/$ZIP"
echo "   https://github.com/rsms/raster/releases/new?tag=v${VERSION}"
echo ""
echo "2) Commit & push changes"
echo ""
echo "————————————————————————————————————————————————————————"

if (which open >/dev/null); then
  open _build
fi
