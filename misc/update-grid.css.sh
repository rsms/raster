#!/bin/bash -e
cd "$(dirname "$0")/.."

VERSION=$(ruby <<SRC
require 'yaml'
print YAML.load_file('_data/info.yml')['version']
SRC
)

echo "node generate-grid.js 30 -version ${VERSION} > grid.css"
node generate-grid.js 30 -version ${VERSION} > grid.css
