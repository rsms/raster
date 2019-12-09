let env = process.env
let isDebug = env.RASTER_DEBUG == '1'

let plugins = [
  require('postcss-import'),
  require('postcss-nested'),
  require('autoprefixer'),
]

if (!isDebug) {
  plugins.push(require('cssnano'))
}

plugins.push(require('postcss-banner')({
  banner: `Raster v${env.RASTER_VERSION} (rsms.me/raster)`,
  inline: true,
}))

module.exports = {
  map: isDebug,
  plugins,
}
