/* Node.js version */
const fetcher = require('node-fetch')
const PicoGraphQL = require('./client')

class NodePicoGraphQL extends PicoGraphQL {
  constructor(config) {
    super(config, fetcher)
  }
}

module.exports = NodePicoGraphQL
