var withFonts = require("next-fonts")

// re-use the baseUrl + paths set in tsconfig.json for webpacks resolve.alias config:
var TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

if (process.env.NODE_ENV !== 'production') {
  var execSync = require('child_process').execSync;
  var version = execSync('git rev-parse HEAD').toString();
  process.env['LAST_COMMIT'] = version;
}

var config = withFonts({
  // Which environment variables should be exposed to the client?
  // We expose the same variables here that are used in the config so we don't have 
  // to pass them via redux store and check for isServer / process.browser etc.
  env: {
    AUTH_COOKIE_NAME: process.env.AUTH_COOKIE_NAME,
    AUTH_IDLE_TIMEOUT: process.env.AUTH_IDLE_TIMEOUT,
    AUTH_LOCALSTORAGE_NAME: process.env.AUTH_LOCALSTORAGE_NAME,
    AUTH_REFRESH_THRESHOLD: process.env.AUTH_REFRESH_THRESHOLD,
    BASE_URL: process.env.BASE_URL,
    CLIENT_ENV: process.env.NODE_ENV,
    FCP_API_ENTRYPOINT: process.env.FCP_API_ENTRYPOINT,
    LAST_COMMIT: process.env.LAST_COMMIT,
  },

  onDemandEntries: {
    // Make sure entries are not getting disposed.
    maxInactiveAge: 1000 * 60 * 15,

    pagesBufferLength: 5
  },

  webpack(config, options) {
    if (config.resolve.plugins) {
      config.resolve.plugins.push(new TsconfigPathsPlugin());
    } else {
      config.resolve.plugins = [new TsconfigPathsPlugin()];
    }

    return config
  },
})

if (process.env.ANALYZE === "true") {
  var withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: true,
  })
  config = withBundleAnalyzer(config)
}

module.exports = config
