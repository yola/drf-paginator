#!/bin/bash

set -eu

proj=$(dirname "$0")/..
cd "$proj"

rm -rf cjs

echo "Compiling to ES5+CommonJS ..."
for f in $(find src -name "*.js" ! -name '*-spec.js')
do
    in=$f
    out=${f/src/cjs}
    mkdir -p $(dirname $out)
    echo "  $in > $out"
    node_modules/.bin/babel $in > $out
done

echo
