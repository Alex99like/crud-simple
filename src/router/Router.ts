import { IHandler, METHOD } from "../helpers/statusCode.js"

export class Router {
  endpoints: Record<string, Record<string, IHandler>>
  constructor() {
    this.endpoints = {}
  }

  add(method: METHOD = METHOD.GET, endpoint: string, handler: IHandler) {
    const path = { [method]: handler } 
    this.endpoints[endpoint] = path
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