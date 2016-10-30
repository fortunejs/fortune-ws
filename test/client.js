'use strict'

const run = require('tapdance')
const testInstance = require('fortune/test/integration/test_instance')
const fortuneWS = require('../lib')
const buffer = Buffer.from || Buffer


run((assert, comment) => {
  comment('fortune wire protocol')

  const port = 8890
  let store, client, remote

  return new Promise(resolve => setTimeout(resolve, 1 * 1000))
  .then(() => testInstance())
  .then(instance => {
    store = instance
    client = new WebSocket(`ws://localhost:${port}`)
    fortuneWS.sync(client, store)

    try {
      fortuneWS.request(client)
      assert(false, 'should have failed')
    }
    catch (error) {
      assert(true, 'options or state required')
    }

    return fortuneWS.request(client, null, { foo: 'bar' })
  })
  .then(result => {
    assert(result.state.foo === 'bar', 'connection state is set')
    return fortuneWS.request(client, { type: 'user' })
  })
  .then(result => {
    assert(result.response.payload.records.length === 3, 'records fetched')
    assert(result.response.payload.count === 3, 'valid count')

    return Promise.all([
      new Promise(resolve => {
        store.once(store.common.events.sync, changes => {
          assert(changes.create.user.length === 1, 'records synced')
          return resolve(changes)
        })
      }),
      fortuneWS.request(client, {
        method: store.common.methods.create,
        type: 'user',
        payload: [
          {
            picture: buffer('cafebabe', 'hex')
          }
        ]
      })
    ])
  })
  .then(results => {
    assert(results[1].response.payload.records.length === 1, 'record created')
  })
  .then(kill, error => {
    kill()
    throw error
  })

  function kill () {
    return fortuneWS.request(client, null, { kill: true })
  }
})
