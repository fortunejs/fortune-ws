'use strict'

var msgpack = require('msgpack-lite')


module.exports = sync


/**
 * Given a W3C WebSocket client and an instance of Fortune, try to synchronize
 * records based on the `changes` data pushed from the server. This function
 * returns the event listener function.
 *
 * When a sync is completed, it emits the `sync` event with the changes data,
 * or the `failure` event if something failed.
 *
 * Optionally, a `merge` function may be passed, which accepts one argument,
 * the remote changes, and is expected to return the changes to accept. This
 * is useful for preventing remote changes from overriding local changes.
 *
 * @param {WebSocket} client
 * @param {Fortune} instance
 * @param {Function} [merge]
 * @return {Function}
 */
function sync (client, instance, merge) {
  var events, syncEvent, failureEvent

  if (!instance.emit || !instance.adapter)
    throw new TypeError('An instance of Fortune is required.')

  events = instance.common.events
  syncEvent = events.sync
  failureEvent = events.failure

  client.binaryType = 'arraybuffer'
  client.addEventListener('message', syncListener)

  function syncListener (event) {
    var data, promises = [], changes, method, type

    if ('decoded' in event) data = event.decoded
    else
      try {
        data = event.decoded = msgpack.decode(new Uint8Array(event.data))
      }
      catch (error) {
        return instance.emit(failureEvent, error)
      }

    // Ignore if changes are not present.
    if (!('changes' in data)) return null

    changes = merge === void 0 ? data.changes : merge(data.changes)

    for (method in changes)
      for (type in changes[method])
        promises.push(instance.adapter[method](type, changes[method][type]))

    return Promise.all(promises)
    .then(function () {
      instance.emit(syncEvent, changes)
    }, function (error) {
      instance.emit(failureEvent, error)
    })
  }

  return syncListener
}
