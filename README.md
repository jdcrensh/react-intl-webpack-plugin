# @MmtBkn/react-intl-webpack-plugin

This plugin helps when using react-intl for internationalization of react apps.
## Fork

There should be a way to live reload when message changes. Let's imlement it here. 
Note, It's not implemented, yet!

## Fork @climate

This fork adds a few options for generating the JSON output:

* Changes JSON output to be simple key-value pairs
* Orders outputted keys alphabetically
* Removes all whitespace from values, i.e. spaces and newlines in multiline ES6 strings.

## Workflow

1. Use `<FormattedMessage id="newItem" defaultMessage="Add item" />` for adding text in your react components.
2. Use the babel plugin `babel-plugin-react-intl` to extract them from your source code.
3. Use `react-intl-webpack-plugin` to combine them into one message file called `reactIntlMessages.json` and put this file into the webpack output path.
4. Use CAT (Computer Aided Translation) tools (like the cloud based memsource.com or okapi) to translate this file into the translated file. These tools use a concept called Translation Memory (TM) . This is a separate file where all translations are stored and with this file all translations can be reapplied to a newly generated `reactIntlMessages.json` file.
5. Save the TM file and the translated json file in a separate directory of your source code.
6. Use `reactIntlJson-loader` to load the translated files and convert them to messages.

## Installation

`yarn add -D @climate/react-intl-webpack-plugin`
or
`npm install @climate/react-intl-webpack-plugin --save-dev`

- this works only with babel-loader >= 6.4.0
- you will need also the babel plugin `babel-plugin-react-intl`

webpack.config.js:
- add the plugin
```javascript
var ReactIntlPlugin = require('react-intl-webpack-plugin');
// ...
plugins: [
  // ...
  new ReactIntlPlugin({
    // see options section
  })
],
```
- modify your babel-loader to contain the `metadataSubscribers` option
```javascript
module: {
  // ...
  rules: [
    // ...
    {
      test: /\.jsx?$/,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: [['es2015', { 'modules': false }], 'react', 'stage-0'],
          plugins: [
            ['react-intl', {
              messagesDir: path.resolve(__dirname, 'dist', 'i18n')
            }]
          ],
          metadataSubscribers: [ReactIntlPlugin.metadataContextFunctionName],
          cacheDirectory: true
        }
      }]
    }
  ]
}
```

- the generated file is called `<messagesDir>/reactIntlMessages.json`

## Options

`sortKeys` (boolean, default `true`): If true, sorts JSON output by message id

`flatOutput` (boolean, default `false`): If true, outputs as a simple key-value pair, i.e. `{'key1': 'text', 'key2': 'text'}`

`collapseWhitespace` (boolean, default `false`): If true, collapses all inner whitespace and newlines. Useful for ES6 multiline template literals.

## Notes

- Keep in mind that as long as you use webpack-dev-server all assets are generated in memory. To access those assets use either:
    - the browser an check http://localhost:devServerPort/reactIntlMessages.json
    - or, add a script to package.json like `"trans:refreshJsonDEV": "curl localhost:3100/reactIntlMessages.json >./dist/reactIntlMessages.json"`
    - or start your webpack build to generate the assets into the build directory.

- If no messages are generated it could be helpful to cleanup the `cacheDirectory` of the babel-loader, or set `"cacheDirectory": false` temporarily

## License

MIT (http://www.opensource.org/licenses/mit-license.php)
