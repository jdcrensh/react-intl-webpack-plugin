var _reduce = require('lodash.reduce');
var _sortBy = require('lodash.sortby');

function collapseWhitespace(str) {
  return str.replace(/[\s\n]+/g, ' ');
}

function ReactIntlPlugin(options) {
  this.options = options || {};
}

ReactIntlPlugin.prototype.apply = function (compiler) {
  var _this = this;
  var messages = [];

  compiler.plugin('compilation', function (compilation) {
    compilation.plugin('normal-module-loader', function (context) {
      context.metadataReactIntlPlugin = function (metadata) {
        messages = messages.concat(metadata['react-intl'].messages);
      };
    });
  });

  compiler.plugin('emit', function (compilation, callback) {
    var jsonMessages = _reduce(_sortBy(messages, 'id'), function (result, m) {
      if (m.defaultMessage) {
        m.defaultMessage = m.defaultMessage.trim();
        if (_this.options.collapseWhitespace) {
          m.defaultMessage = collapseWhitespace(m.defaultMessage);
        }
        result[m.id] = m.defaultMessage;
      }
      return result;
    }, {});

    var jsonString = JSON.stringify(jsonMessages, undefined, 2);

    compilation.assets['reactIntlMessages.json'] = {
      source: function () {
        return jsonString;
      },
      size: function () {
        return jsonString.length;
      }
    };

    callback();
  });
};

module.exports = ReactIntlPlugin;
module.exports.metadataContextFunctionName = 'metadataReactIntlPlugin';
