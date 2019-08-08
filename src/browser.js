/* Browser version */
const fetcher = window.fetch
const PicoGraphQL = require('./client')

class BrowserPicoGraphQL extends PicoGraphQL {
  constructor(config) {
    super(config, fetcher)
  }
}

module.exports = BrowserPicoGraphQL
