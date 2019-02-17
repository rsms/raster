#!/bin/bash -e
cd "$(dirname "$0")/.."
cp misc/_config.yml _config.yml
jekyll serve \
  --watch \
  --host 0.0.0.0 \
  --port 3009 \
  --livereload \
  --livereload-port 30090
