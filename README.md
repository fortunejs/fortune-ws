# Fortune WebSocket

[![Build Status](https://img.shields.io/travis/fortunejs/fortune-ws/master.svg?style=flat-square)](https://travis-ci.org/fortunejs/fortune-ws)
[![npm Version](https://img.shields.io/npm/v/fortune-ws.svg?style=flat-square)](https://www.npmjs.com/package/fortune-ws)
[![License](https://img.shields.io/npm/l/fortune-ws.svg?style=flat-square)](https://raw.githubusercontent.com/fortunejs/fortune-ws/master/LICENSE)

This is a WebSocket implementation for Fortune.js, which implements a wire protocol based on MessagePack.

```sh
$ npm install fortune-ws --save
```


## Usage

Consult the [source code](https://github.com/fortunejs/fortune-ws/tree/master/lib) or the [documentation website](http://fortune.js.org/api) for more information.

```js
const fortuneWS = require('fortune-ws')

// Pass in a Fortune instance and an optional change function,
// options object, and connection callback.
const server = fortuneWS(instance, change, options, callback)

// There is also a client request function.
const promise = fortuneWS.request(client, options, state)

// Automatically syncing client, given a Fortune instance.
const listener = fortuneWS.sync(client, instance)
```

The browser version includes the client implementations but not the server.


## License

This software is licensed under the [MIT license](https://raw.githubusercontent.com/fortunejs/fortune-ws/master/LICENSE).
