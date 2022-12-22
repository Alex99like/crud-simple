import http from 'http'
import { Router } from './router/Router.js';
import { UserService } from './service/User.js';
import { HttpCode, METHOD, ReqType, ResType } from './helpers/statusCode.js';
import { IUser } from './helpers/user.interface.js';
import EventEmitter from 'events'
import { checkReq } from './helpers/checkReq.js';
import { v4 } from 'uuid'

export class Server {
  server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>
  port: undefined | number;
  service: UserService
  db: IUser[]
  emitter: EventEmitter;

  constructor() {
    this.port = undefined;
    this.db = [{ age: 21, id: '21123', hobbies: [], username: 'Alex' }]
    this.server = this.createServer()
    this.emitter = new EventEmitter()
    
    this.service = new UserService(this.db)
    this.createEndpoints()
  }

  listen(port: number, callback: () => void) {
    this.port = port
    this.server.listen(port, callback)
  }

  createEndpoints() {
    this.emitter.on(this.createPath(METHOD.GET), this.getUsers.bind(this))
    this.emitter.on(this.createPath(METHOD.POST), this.createUser.bind(this))
    this.emitter.on(this.createPath(METHOD.PUT), this.updateUser.bind(this))
    this.emitter.on(this.createPath(METHOD.DELETE), this.deleteUser.bind(this))
  }

  getUsers(req: ReqType, res: ResType, db: IUser[]) {
    res.send(this.db)
  }

  createUser(req: ReqType, res: ResType) {
    let body = ''
    req.on('data', (chunk) => {
      body += chunk
    })
    req.on('end', () => {
      const user = JSON.parse(body)
      const errors = checkReq(user)

      if (errors.length === 0) {
        this.db.push({ id: v4(), username: user.username, age: user.age, hobbies: user.hobbies })
        res.writeHead(HttpCode.Created)
        res.send(user)
      } else {
        res.writeHead(HttpCode.BadReq)
        res.send({ errors })
      }
    })
  }

  updateUser(req: ReqType, res: ResType) {}

  deleteUser(req: ReqType, res: ResType) {}

  createPath(method: string) {
    return `api/users:${method}`
  }

  createServer() {
    return http.createServer((req, res) => {
      (res as ResType).send = (data) => {
        res.end(JSON.stringify(data))
      }

      const emit = this.emitter.emit(`${req.url?.slice(1)}:${req.method}`, req, res, this.db)
      if (!emit) (res as ResType).send({message: HttpCode.NotFound })
    })
  }
}