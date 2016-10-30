'use strict'

const fortuneWS = require('../lib')
const testInstance = require('fortune/test/integration/test_instance')

const port = 8890

testInstance()
.then(instance => fortuneWS(instance, (state, changes) => {
  if (changes) return changes
  if (state.kill) setTimeout(() => process.exit(), 100)
  return state
}, { port }))
