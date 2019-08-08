const fetch = require('./fetch')

const defaults = {useCdn: true}

class PicoGraphQL {
  constructor(config, fetcher) {
    this.fetcher = fetcher
    this.config = {...defaults, ...config}
    this.middleware = config.middleware || []
  }

  fetch(query, variables) {
    return fetch(this.fetcher, this.config, this.reduceQuery(query), variables)
  }

  reduceQuery(query, variables) {
    return this.middleware.reduce((acc, process) => process(acc, variables), query)
  }

  use(middleware) {
    this.middleware.push(middleware)
    return this
  }
}

module.exports = PicoGraphQL
