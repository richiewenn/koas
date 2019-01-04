import KoaRouter from 'koa-router'
import * as fs from 'fs'
import * as path from 'path'
import glob from 'glob'
import { schemaForTypeScriptSources } from 'quicktype-typescript-input'
import { Oas, OasInfo, OasOperation, OasPathItem, OasPaths, OasResponses } from '@koas/oas'
import methods from 'methods'

class OasSingleton {
  info?: OasInfo
  paths: Array<OasPaths> = []
  globalMiddlewareOperations: Array<OasOperation> = []

  getOasV3(): Oas {
    if (!this.info) {
      throw new Error('info is not defined in OasSingleton')
    }

    return {
      openapi: '3.0.0',
      paths: this.paths.reduce((previousValue, currentValue) => {
        return {
          ...previousValue,
          ...currentValue,
        }
      }, {}),
      info: this.info,
    }
  }
}

export const oas = new OasSingleton()

export class Router {
  router: KoaRouter

  constructor(private oasRouter: OasRouterBuilder = {}) {
    this.router = new KoaRouter(oasRouter)
  }

  register(
    path: string | RegExp,
    methods: Array<Router.HttpMethod>,
    middleware: KoaRouter.IMiddleware,
    opts?: OasOperation | Object
  ): Router {
    for (const method of methods) {
      const fullPath = `${this.oasRouter.prefix || ''}${path.toString()}`
      oas.paths.push({
        [fullPath]: {
          [method]: opts || {},
        },
      })
    }
    this.router.register(path, methods, middleware, opts)
    return this
  }

  private registerMethod(method: string) {
    const that = this
    class F {
      registerRoute(path: string | RegExp | (string | RegExp)[], ...middleware: Array<KoaRouter.IMiddleware | OasOperation>): Router
      registerRoute(name: string, path?: string | RegExp | KoaRouter.IMiddleware | OasOperation | undefined, ...middleware: Array<KoaRouter.IMiddleware | OasOperation>): Router {
        if (typeof path === 'string' || path instanceof RegExp) {
          const mdwr: Array<KoaRouter.IMiddleware | OasOperation> = Array.prototype.slice.call(arguments, 2)
          const maybeOasOperation = mdwr.find(it => typeof it === 'object')
          mdwr
            .filter(it => typeof it === 'function')
            .forEach((it: KoaRouter.IMiddleware | OasOperation) =>
              that.register(path, [method], it as KoaRouter.IMiddleware, { name, ...maybeOasOperation })
            )
        } else {
          const mdwr = Array.prototype.slice.call(arguments, 1)
          const maybeOasOperation = mdwr.find(it => typeof it === 'object')
          mdwr
            .filter(it => typeof it === 'function')
            .forEach((it: KoaRouter.IMiddleware) => that.register(name, [method], it, maybeOasOperation))
        }
        return that
      }
    }

    return new F().registerRoute
  }
  //  use(path: string | string[] | RegExp, ...middleware: Array<KoaRouter.IMiddleware>): KoaRouter {
  //    return this.router.use(path, ...middleware);
  //  }
  get(path: string | RegExp | (string | RegExp)[], ...middleware: Array<KoaRouter.IMiddleware | OasOperation>): this
  get(name: string, path?: string | RegExp | KoaRouter.IMiddleware | OasOperation, ...middleware: Array<KoaRouter.IMiddleware | OasOperation>): this {
    return this.registerMethod('get')(name, path, ...middleware)
  }

    post(path: string | RegExp | (string | RegExp)[], ...middleware: Array<KoaRouter.IMiddleware>): this
    post(name: string, path: string | RegExp | KoaRouter.IMiddleware, ...middleware: Array<KoaRouter.IMiddleware>): this {
      if (typeof path === 'string' || path instanceof RegExp) {
        const mdwr = Array.prototype.slice.call(arguments, 2)
        mdwr.forEach((it: KoaRouter.IMiddleware) => this.register(path, ['post'], it, { name }))
      } else {
        const mdwr = Array.prototype.slice.call(arguments, 1)
        mdwr.forEach((it: KoaRouter.IMiddleware) => this.register(name, ['post'], it))
      }
      return this
    }
  //
  //  put(path: string | RegExp | (string | RegExp)[], ...middleware): KoaRouter {
  //    return this.router.put(path, ...middleware);
  //  }
  //
  //  link(path: string | RegExp | (string | RegExp)[], ...middleware): KoaRouter {
  //    return this.router.link(path, ...middleware);
  //  }
  //
  //  unlink(path: string | RegExp | (string | RegExp)[], ...middleware): KoaRouter {
  //    return this.router.unlink(path, ...middleware);
  //  }
  //
  //  delete(path: string | RegExp | (string | RegExp)[], ...middleware): KoaRouter {
  //    return this.router.delete(path, ...middleware);
  //  }
  //
  //  del(path: string | RegExp | (string | RegExp)[], ...middleware): KoaRouter {
  //    return this.router.del(path, ...middleware);
  //  }
  //
  //  head(path: string | RegExp | (string | RegExp)[], ...middleware): KoaRouter {
  //    return this.router.head(path, ...middleware);
  //  }
  //
  //  options(path: string | RegExp | (string | RegExp)[], ...middleware): KoaRouter {
  //    return this.router.options(path, ...middleware);
  //  }
  //
  //  patch(path: string | RegExp | (string | RegExp)[], ...middleware): KoaRouter {
  //    return this.router.patch(path, ...middleware);
  //  }
  //
  //  all(path: string | RegExp | (string | RegExp)[], ...middleware): KoaRouter {
  //    return this.router.all(path, ...middleware);
  //  }
  //
  //  prefix(prefix: string): KoaRouter {
  //    return this.router.prefix(prefix);
  //  }

  //  routes(): Application.Middleware {
  //    return this.router.routes();
  //  }
  //
  //  middleware(): Application.Middleware {
  //    return this.router.middleware();
  //  }
  //
  //  allowedMethods(options?: Router.IRouterAllowedMethodsOptions): Application.Middleware {
  //    return this.router.allowedMethods(options);
  //  }
  //
  //  redirect(source: string, destination: string, code?: number): Router {
  //    return this.router.redirect(source, destination, code);
  //  }
  //
  //  route(name: string): boolean {
  //    return this.router.route(name);
  //  }
  //
  //  url(name: string, params: any, options?: Router.IUrlOptionsQuery): Error {
  //    return this.router.url(name, params, options);
  //  }
  //
  //  match(path: string, method: string): Router.IRoutesMatch {
  //    return this.router.match(path, method);
  //  }
  //
  //  param(param: string, middleware: Router.IParamMiddleware): Router {
  //    return this.router.param(param, middleware);
  //  }
}

declare namespace Router {
  //  export interface IMiddleware {
  //    (oas: OasRouterBuilder): (ctx: KoaRouter.IRouterContext, next: () => Promise<any>) => any;
  //  }

  export interface IParamMiddleware {
    (oas: OasRouterBuilder): (
      param: string,
      ctx: KoaRouter.IRouterContext,
      next: () => Promise<any>
    ) => any
  }
  export type HttpMethod = methods
}

export interface OasRouterRegister extends OasPathItem {
  //  parameters?: object;
  //  responses?: OasResponses;
  //  summary?: string;
  //  description?: string;
  //  headers?: object; // JSON schema
  //  query?: object; // JSON schema
  //  payload?: object; // JSON schema
}

export interface OasRouterRegisterBuilder {
  path: string
  method: string
  route: OasRouterRegister
}

export interface OasRouterBuilder extends KoaRouter.IRouterOptions {}

export interface OasResponseDef {
  description: string
}

export const HttpResponses = {}

export function getDefinitions(filePath: string): object {
  const schema = schemaForTypeScriptSources([path.resolve(filePath)]).schema
  return JSON.parse(schema || '').definitions
}

export const importDefinitions = () =>
  new Promise((resolve, reject) => {
    glob('**/*.model.ts', {}, function(err, files) {
      if (err) {
        reject(err)
        return
      }
      const def = files.map(getDefinitions).reduce(
        (previousValue, currentValue) => ({
          ...previousValue,
          ...currentValue,
        }),
        {}
      )
      resolve(def)
    })
  })

export const createJsonSchemaFiles = () =>
  new Promise((resolve, reject) => {
    glob('**/*.api.ts', {}, function(err, files) {
      if (err) {
        reject(err)
        return
      }
      files.forEach(file => {
        const def = getDefinitions(file)
        fs.writeFile(file.replace(/\.ts$/, '.json'), JSON.stringify(def, null, 2), err => {
          if (err) {
            console.error(err)
          }
        })
      })

      resolve()
    })
  })

createJsonSchemaFiles()

// importDefinitions()
// .then(def => fs.writeFileSync('jsonSchema.json', JSON.stringify(def, null, 2)))
