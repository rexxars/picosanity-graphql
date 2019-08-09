# picosanity-graphql

[![npm version](https://img.shields.io/npm/v/picosanity-graphql?style=flat-square)](https://www.npmjs.com/package/picosanity-graphql)[![Build Status](https://img.shields.io/travis/rexxars/picosanity-graphql/master.svg?style=flat-square)](https://travis-ci.org/rexxars/picosanity-graphql)

Tiny GraphQL request library for Sanity for Node.js and modern browsers.

## Targets

- Node.js >= 8
- Modern browsers (Edge >= 14, Chrome, Safari, Firefox etc)

## Features

- Easy configuration (projectId/dataset instead of URLs)
- Automatically uses GET-requests if within query size limit (prevents CORS preflight request)
- Automatically uses API CDN if within query size limit (faster responses if query is cached)
- Supports running middleware on passed queries before requesting

## Installation

```bash
npm install --save picosanity-graphql
```

## Usage

```js
const PicoGraphQL = require('picosanity-graphql')

const client = new PicoGraphQL({
  projectId: 'myProjectId',
  dataset: 'myDataset'
})

client
  .fetch(
    `
    query($limit: Int!) {
      allBlogPost(limit: $limit) {
        _id
        title
      }
    }`,
    {limit: 5}
  )
  .then(res => console.log(res.data))
  .catch(err => console.error('Oh noes: %s', err.message))
```

## Compressing queries

If you have a lot of whitespace in your queries (from indentation and such), I recommend you use a module such as [graphql-query-compress](https://github.com/rse/graphql-query-compress) to compress/minify the query down to the essentials.

This can often lead to a huge difference in query size and will often lead to the queries being executed as GET-requests instead of POST-requests, which prevents an extra CORS pre-flight request.

To use the mentioned module, first install it as a dependency (`npm install graphql-query-compress`), then tell the client to use it:

```js
const compress = require('graphql-query-compress')
const PicoGraphQL = require('picosanity-graphql')

const client = new PicoGraphQL({
  projectId: 'myProjectId',
  dataset: 'myDataset',
  middleware: [compress]
  // ...or call `.use(compress)` on an existing client instance
})

client
  .fetch(longQuery)
  .then(res => console.log(res.data))
  .catch(err => console.error('Oh noes: %s', err.message))
```

## UMD bundle

You can load this module as a UMD-bundle from unpkg - https://unpkg.com/picosanity-graphql  
If used in a global browser context, it will be available as `window.PicoSanityGraphQL`

## License

MIT © [Espen Hovlandsdal](https://espen.codes/)
