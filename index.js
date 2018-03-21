/*
  eslint
  fp/no-mutation:0,
  import/no-commonjs:0,
  fp/no-let:0
*/

const { pipe, either } = require('ramda')
const { join } = require('path')
const { statSync } = require('fs')
const DotenvPlugin = require('webpack-dotenv-plugin')

const reducePluginLeft = pipe(
  ({ plugins, ...webpackConfig }) => ({
    ...webpackConfig,
    plugins: plugins || [],
  }),
  ({ plugins: [pluginToReduce, ...plugins], ...webpackConfig }) => ({
    ...webpackConfig,
    plugins,
  }),
)

const web = pipe(
  ({ node, ...webpackConfig }) => ({
    ...webpackConfig,
    node: either(node, {}),
  }),
  ({ node, ...webpackConfig }) => ({
    ...webpackConfig,
    target: 'web',
    node: {
      ...node,
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      module: 'empty',
      console: false,
    },
  }),
)

const dotEnv = pipe(
  webpackConfig => ({ webpackConfig }),
  ({ ...state }) => {
    let dotEnvExists = false

    try {
      dotEnvExists = statSync('.env') ? true : false
    } catch (error) {
      dotEnvExists = false
    }

    return { ...state, dotEnvExists }
  },
  ({ ...state }) => ({
    ...state,
    dotEnvPath: join(__dirname, '.env'),
  }),
  ({ dotEnvPath: path, dotEnvExists, ...state }) => ({
    ...state,
    dotEnvPath: path,
    dotEnvPlugin: dotEnvExists ? [new DotenvPlugin({ path })] : [],
  }),
  ({
    webpackConfig: { plugins: webpackPlugins, ...webpackConfig },
    ...state
  }) => ({
    ...state,
    webpackPlugins: either(webpackPlugins, []),
    webpackConfig,
  }),
  ({ dotEnvPlugin, webpackPlugins, webpackConfig, ...state }) => ({
    ...webpackConfig,
    plugins: [...webpackPlugins, ...dotEnvPlugin],
  }),
)

module.exports = {
  reducePluginLeft,
  dotEnv,
  web,
}
