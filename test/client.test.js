/* eslint-disable no-process-env */
const compress = require('graphql-query-compress')
const Client = require('../src')

const domain = process.env.PICOGQL_API_DOMAIN
const projectId = process.env.PICOGQL_PROJECT_ID || '89qx0zd4'
const dataset = process.env.PICOGQL_DATASET || 'sweets'
const expectedId = '9e2a73f1-d97a-4653-b360-cf76759dff83'
const expectedBody = {
  data: {
    Product: {
      _id: expectedId
    }
  }
}

test('can query', () => {
  const client = new Client({projectId, dataset, domain})
  return expect(client.fetch(`{Product(id: "${expectedId}"){_id}}`)).resolves.toMatchObject(
    expectedBody
  )
})

test('can query with params', () => {
  const client = new Client({projectId, dataset, domain})
  return expect(
    client.fetch(`query($id:ID!){Product(id: $id){_id}}`, {id: expectedId})
  ).resolves.toMatchObject(expectedBody)
})

test('can query with huge queries (switching to post)', () => {
  const client = new Client({projectId, dataset, domain})
  const longId = new Array(5000).join(expectedId)
  return expect(
    client.fetch(`query($id:ID!){Product(id: $id){_id}}`, {id: longId})
  ).resolves.toMatchObject({data: {Product: null}})
})

test('can use middleware', () => {
  const client = new Client({projectId, dataset, domain})
  client.use(compress)

  const muchWhitespace = new Array(30000).join(' ')
  const inputQuery = `query  ($id: ID!)${muchWhitespace}{ Product(id: $id) {_id} }`
  const variables = {id: expectedId}
  expect(client.reduceQuery(inputQuery, variables).length).toBeLessThan(inputQuery.length)
  return expect(client.fetch(inputQuery, variables)).resolves.toMatchObject(expectedBody)
})
