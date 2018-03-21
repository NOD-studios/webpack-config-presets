# @nod/webpack-config-presets
Reusable and composable webpack presets

## Installation
```bash
npm i -D @nod/webpack-config-presets
```

## Usage
```javascript
const {
  web, // web safe build without native node modules
  dotEnv, // loads dotenv environment variables
  reducePluginLeft, // drops the first defined plugin useful
} = require('@nod/webpack-config-presets')

const config = {} //...your custom Webpack Config
module.exports = web(dotEnv(reducePluginLeft(yourWebpackConfig))),
```

## Development and additional usage
Please see [@nod/nod](https://github.com/NOD-studios/nod) monorepo

## License
Apache 2.0
