'use strict'

var request = require('./request')
var sync = require('./sync')

// Browser entry point.
module.exports = {
  request: request,
  sync: sync
}
