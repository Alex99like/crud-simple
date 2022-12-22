import { IHandler, METHOD } from "../helpers/statusCode.js"

export class Router {
  endpoints: Record<string, Record<string, IHandler>>
  constructor() {
    this.endpoints = {}
  }

  add(method: METHOD = METHOD.GET, path: string, handler: IHandler) {
    if (!this.endpoints[path]) this.endpoints[path] = {}
    const endpoint = this.endpoints[path]
    endpoint[method] = handler
  }

  get(path: string, handler: IHandler) {
    this.add(METHOD.GET, path, handler)
  }

  post(path: string, handler: IHandler) {
    this.add(METHOD.POST, path, handler)
  }

  put(path: string, handler: IHandler) {
    this.add(METHOD.PUT, path, handler)  
  }

  delete(path: string, handler: IHandler) {
    this.add(METHOD.DELETE, path, handler)
  }
}