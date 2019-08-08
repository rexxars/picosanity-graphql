const MAX_QUERY_SIZE = 10000
const enc = encodeURIComponent
const defaultDomain = 'sanity.io'
const apiHost = 'api'
const cdnHost = 'apicdn'

function fetch(fetcher, config, query, variables) {
  const {useCdn, domain, withCredentials, token, projectId, dataset} = config

  const encodedQueryString = getQs(query, variables)
  const useGet = encodedQueryString.length < MAX_QUERY_SIZE
  const hostDomain = domain || defaultDomain
  const api = useGet && useCdn ? cdnHost : apiHost
  const queryString = useGet ? encodedQueryString : ''
  const url = `https://${projectId}.${api}.${hostDomain}/v1/graphql/${dataset}/default${queryString}`
  const reqOpts = {
    credentials: withCredentials || token ? 'include' : 'omit',
    method: useGet ? 'GET' : 'POST'
  }

  if (!useGet) {
    reqOpts.body = JSON.stringify({query, variables})
    reqOpts.headers = {'content-type': 'application/json'}
  }

  return fetcher(url, reqOpts)
    .then(maybeParse)
    .then(maybeThrow)
}

function maybeParse(res) {
  const contentType = res.headers.get('content-type') || ''
  if (contentType.indexOf('application/json') === -1) {
    throw new Error(`Query returned error: HTTP ${res.status} ${res.statusText}`)
  }

  return res.json().then(body => ({response: res, body}))
}

function maybeThrow({response, body}) {
  if (!body.data && Array.isArray(body.errors)) {
    throw new Error(`Query returned error: ${body.errors[0].message}`)
  } else if (!body.data) {
    throw new Error(`Query returned error: HTTP ${response.status} ${response.statusText}`)
  }

  return body
}

function getQs(query, variables) {
  const baseQs = `?query=${enc(query)}`
  const varsQs = variables ? `&variables=${enc(JSON.stringify(variables))}` : ''
  return `${baseQs}${varsQs}`
}

module.exports = fetch
