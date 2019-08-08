// Type definitions for picosanity-graphql
// Project: picosanity-graphql
// Definitions by: Espen Hovlandsdal <https://espen.codes>

export = PicoSanityGraphQL

declare class PicoSanityGraphQL {
  constructor(config: PicoSanityGraphQL.PicoSanityGraphQLConfig)

  fetch(
    query: string,
    variables?: {[key: string]: any}
  ): Promise<PicoSanityGraphQL.PicoSanityGraphQLResponse>

  reduceQuery(query: string, variables?: {[key: string]: any}): string

  use(middleware: Function): PicoSanityGraphQL
}

declare namespace PicoSanityGraphQL {
  export interface PicoSanityGraphQLConfig {
    projectId: string
    dataset: string
    withCredentials?: boolean
    token?: string
    useCdn?: boolean
    domain?: string
  }

  export interface PicoSanityGraphQLResponse {
    data: {[key: string]: any}
    errors?: GraphQLError[]
  }

  export interface GraphQLLocation {
    line: number
    column: number
  }

  export interface GraphQLError {
    message: string
    locations?: GraphQLLocation[]
  }
}
