import http from 'http'
import { UserService } from './service/User';
import { HttpCode, METHOD, ReqType, ResType } from './helpers/statusCode';
import { IUser } from './helpers/user.interface';
import EventEmitter from 'events'
import cluster from "cluster";
import {MessageErr} from "./helpers/ErrorMessage";

export class Server {
  db: IUser[];
  server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
  emitter: EventEmitter;
  userService: UserService;

  constructor() {
    this.db = []
    this.emitter = new EventEmitter()
    this.server = this.createServer()
    this.userService = new UserService()
    this.setEndpoints()
    this.listenMaster()
  }

  setEndpoints() {
    this.emitter.on(this.path(METHOD.GET), this.userService.getUser.bind(this))
    this.emitter.on(this.path(METHOD.POST), this.userService.createUser.bind(this))
    this.emitter.on(this.path(METHOD.PUT), this.userService.updateUser.bind(this))
    this.emitter.on(this.path(METHOD.DELETE), this.userService.removeUser.bind(this))
  }

  sendDB(db: IUser[]) {
    process.send && process.send(db)
  }

  listenMaster() {
    process.on('message', (data) => {
      this.db = data as IUser[]
    })
  }

  listen(port: string | number, cb: () => void) {
    this.server.listen(port)
    cb()
  }

  path(method: string, root: string = 'api', path: string = 'users') {
    return `${root}/${path}:${method}`
  }

  emit(req: http.IncomingMessage, res: http.ServerResponse, root: string, path: string, parameter: string) {
    const emit = this.emitter.emit(this.path(req.method!, root, path), req, res, parameter, this.db, this.sendDB)

    if (!emit) {
      (res as ResType).send(HttpCode.NotFound, MessageErr.urlExists)
    }
  }
  
  createServer() {
    return http.createServer((req, res) => {
      try {
        (res as ResType).send = (code: HttpCode, data: any) => {
          res.writeHead(code)
          res.end(JSON.stringify(data))
        }

        const [root = '', path = '', parameter, error] = req.url!.split('/').slice(1)

        if (error) {
          (res as ResType).send(HttpCode.NotFound, MessageErr.urlExists)
        } else {
          if (cluster.worker) {
            if (req.headers['balancer']) {
              this.emit(req, res, root, path, parameter)
            } else {
              (res as ResType).send(HttpCode.NotFound, MessageErr.balancer)
            }
          } else {
            this.emit(req, res, root, path, parameter)
          }
        }
      } catch(e) {
        (res as ResType).send(HttpCode.ErrorServer, 'Server Error')
      }
    })
  }
}