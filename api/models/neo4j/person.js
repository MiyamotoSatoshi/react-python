// extracts just the data from the query results

var _ = require('underscore');

var Person = module.exports = function (_node) {
  _(this).extend(_node.data);
};