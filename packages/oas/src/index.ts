// based on https://swagger.io/specification

export interface Oas {
  openapi: string
  info: OasInfo
  //  servers?: OasServers;
  paths: OasPaths
  //  components?: OasComponents;
  //  security?: OasSecurity;
  //  tags?: OasTags;
  //  externalDocs?: OasExternalDocs;
}

export interface OasInfo {
  title: string
  description?: string
  termsOfService?: string
  contact?: OasContact
  licence?: OasLicence
  version: string
}

export interface OasContact {
  name?: string
  url?: string
  email?: string
}

export interface OasLicence {
  name: string
  url?: string
}

export interface OasPaths {
  [path: string]: OasPathItem
}

export interface OasPathItem {
  $ref?: string
  summary?: string
  description?: string
  get?: OasOperation
  put?: OasOperation
  post?: OasOperation
  delete?: OasOperation
  options?: OasOperation
  head?: OasOperation
  patch?: OasOperation
  trace?: OasOperation
  //  servers?: OasServer;
  //  parameter?: OasOarameter | OasReference;
}

export interface OasOperation {
  tags?: Array<string>
  summary?: string
  description?: string
  //  externalDocs?: OasExternalDocs;
  operationId?: string
  parameters?: Array<OasParameter | OasReference>;
  //  requestBody?: OasRequestBody | OasReference;
  responses: OasResponses
  //  callbacks?: Map<string, OasCallback, OasReference>;
  //  security?: OasSecurityRequirement;
  //  servers?: OasServer;
}

export interface OasParameter {
  // TODO
}

export interface OasResponses {
  //  default: OasResponse | OasReference | undefined; // defined like this, coz TS is far from perfect
  //  [key: string]: OasResponse | OasReference | undefined;
  [key: string]: OasResponse | undefined
}

export interface OasReference {
  $ref?: string
}

export interface OasResponse {
  description: string
  //  headers?: Map<string, OasHeader | OasReference>;
  //  content?: Map<string, OasMediaType>;
  content?: OasContent
  //  links?: Map<string, OasLink | OasReference>;
}
export interface OasContent {
  [contentType: string]: OasMediaType
}

export interface OasMediaType {
  schema?: OasSchema
  //  schema?: OasSchema | OasReference;
  example?: any
  //  examples?: Map<string, OasExample | OasReference>
  //  encoding?: Map<string, OasEncoding>
}

export interface OasSchema {
  title: string
  //  multipleOf
  //  maximum
  //  exclusiveMaximum
  //  minimum
  //  exclusiveMinimum
  //  maxLength
  //  minLength
  //  pattern
  //  maxItems
  //  minItems
  //  uniqueItems
  //  maxProperties
  //  minProperties
  //  required
  //  enum
  /** Value MUST be a string. Multiple types via an array are not supported. */
  type: string
  //  allOf?: OasSchema;
  //  oneOf?: OasSchema;
  //  anyOf - Inline or referenced schema MUST be of a Schema Object and not a standard JSON Schema.
  //  not - Inline or referenced schema MUST be of a Schema Object and not a standard JSON Schema.
  //  /**
  //   * Value MUST be an object and not an array.
  //   * Inline or referenced schema MUST be of a Schema Object
  //   * and not a standard JSON Schema.
  //   * items MUST be present if the type is array.
  //   */
  //  items?:
  /** Property definitions MUST be a Schema Object and not a standard JSON Schema (inline or referenced). */
  properties?: OasObjectSchema
  //  additionalProperties - Value can be boolean or object. Inline or referenced schema MUST be of a Schema Object and not a standard JSON Schema. Consistent with JSON Schema, additionalProperties defaults to true.
  /** CommonMark syntax MAY be used for rich text representation. */
  description?: string
  //  format - See Data Type Formats for further details. While relying on JSON Schema's defined formats, the OAS offers a few additional predefined formats.
  //  default - The default value represents what would be assumed by the consumer of the input as the value of the schema if one is not provided. Unlike JSON Schema, the value MUST conform to the defined type for the Schema Object defined at the same level. For example, if type is string, then default can be "foo" but cannot be 1.
}

export interface OasObjectSchema {
  [key: string]: OasSchema | OasReference
}

export enum OasHttpCodes {
  OK = '200',
  BAD_REQEST = '400',
}
