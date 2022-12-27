import http from 'http'
import { UserService } from './service/User';
import { HttpCode, METHOD, ReqType, ResType } from './helpers/statusCode';
import { IUser } from './helpers/user.interface';
import EventEmitter from 'events'

export class Server {
  db: IUser[];
  server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
  emitter: EventEmitter;
  userService: UserService;

  constructor() {
    this.db = [{
      id: "f0222d8c-2ce1-4c36-a41e-3593d8c7c621",
      username: "Alex",  
      hobbies: [
        "game"
      ],
      age: 24
    },
    {
      id: '1234124',
      username: "NoValid",
      hobbies: [
        "game"
      ],
      age: 20
    }
  ]
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
  
  createServer() {
    return http.createServer((req, res) => {
      (res as ResType).send = (code: HttpCode, data: any) => {
        res.writeHead(code)
        res.end(JSON.stringify(data))
      }

      const [root = '', path = '', parameter, error] = req.url!.split('/').slice(1)
      if (error) {
        res.writeHead(HttpCode.NotFound)
        res.end(JSON.stringify(`this url does not exist`))
      } else {
        const emit = this.emitter.emit(this.path(req.method!, root, path), req, res, parameter, this.db, this.sendDB)
      
        if (!emit) {
          res.writeHead(HttpCode.NotFound)
          res.end(JSON.stringify(`this url does not exist`))
        }
      }
    })
  }
}