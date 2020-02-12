const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
})
const withCSS = require("@zeit/next-css")
const withSass = require("@zeit/next-sass")
const withFonts = require("next-fonts")
//const commonsChunkConfig = require('@zeit/next-css/commons-chunk-config')
const commonsChunkConfig = (config, test = /\.css$/) => {
  config.plugins = config.plugins.map(plugin => {
    if (
      plugin.constructor.name === 'CommonsChunkPlugin' &&
      // disable filenameTemplate checks here because they never match
      // (plugin.filenameTemplate === 'commons.js' ||
      //     plugin.filenameTemplate === 'main.js')
      // do check for minChunks though, because this has to (should?) exist
      plugin.minChunks != null
    ) {
      const defaultMinChunks = plugin.minChunks;
      plugin.minChunks = (module, count) => {
        if (module.resource && module.resource.match(test)) {
          return true;
        }
        return defaultMinChunks(module, count);
      };
    }
    return plugin;
  });
  return config;
};

// re-use the baseUrl + paths set in tsconfig.json for webpacks resolve.alias config:
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

module.exports = withBundleAnalyzer(
  withSass(
    withCSS(
      withFonts({
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

          config = commonsChunkConfig(config, /\.(sass|scss|css)$/);

          return config
        },
      })
    )
  )
)

