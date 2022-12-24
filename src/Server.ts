import http from 'http'
import { UserService } from './service/User.js';
import { HttpCode, METHOD, ReqType, ResType } from './helpers/statusCode.js';
import { IUser } from './helpers/user.interface.js';
import EventEmitter from 'events'
import { checkCreate, checkUpdate } from './helpers/checkReq.js';
import { v4, validate } from 'uuid'

export class Server {
  db: IUser[];
  server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
  emitter: EventEmitter;

  constructor() {
    this.db = [{ age: 21, id: '21123', hobbies: [], username: 'Alex' }]
    this.emitter = new EventEmitter()
    this.server = this.createServer()
    this.setEndpoints()
  }

  getUser(req: ReqType, res: ResType, parameter: string) {
    if (parameter) {
      const [user] = this.db.filter(el => el.id === parameter)
      if (user) {
        if (validate(user.id)) {
          res.send(HttpCode.Success, user)
        } else {
          res.writeHead(HttpCode.BadReq)
          res.end()
        }
      } else {
        res.writeHead(HttpCode.NotFound)
        res.end()
      }
    } else {
      res.send(HttpCode.Success, this.db)
    }
  }

  createUser(req: ReqType, res: ResType, parameter: string) {
    if (parameter) {
      res.writeHead(HttpCode.NotFound)
      res.end()
      return
    } else {
      let body = ''
      req.on('data', (chunk) => {
        body += chunk
      })

      req.on('end', () => {
        try {
          const user = JSON.parse(body)
          const errors = checkCreate(user)

          if (errors.length === 0) {
            const id = v4()
            this.db.push({ id, username: user.username, age: user.age, hobbies: user.hobbies })
            res.send(HttpCode.Created, { id, ...user })
          } else {
            res.writeHead(HttpCode.BadReq)
            res.send(HttpCode.BadReq, { errors })
          }
        } catch(e) {}
        
      })
    }
  }

  updateUser(req: ReqType, res: ResType, parameter: string) {
    if (!parameter) {
      res.writeHead(HttpCode.NotFound)
      res.end()
      return
    }

    let body = ''
    req.on('data', (chunk) => {
      body += chunk
    })
    req.on('end', () => {
      const user = JSON.parse(body)
      const errors = checkUpdate(user)

      if (errors.length === 0) {
        let resData: IUser | undefined = undefined
        this.db = this.db.map((el) => {
          if (el.id === parameter) {
            const userItem = {
              id: user.id ? user.id : el.id,
              username: user.username ? user.username : el.username,
              age: user.age ? user.age : el.age,
              hobbies: user.hobbies ? user.hobbies : el.hobbies,
            }
            resData = userItem
            return userItem
          } else {
            return el
          }
        })
        res.send(HttpCode.Success, resData)
        
      } else {
        res.send(HttpCode.BadReq, { errors })
      }
    })
  }

  removeUser(req: ReqType, res: ResType, parameter: string) {
    const [user] = this.db.filter(el => el.id === parameter)
    if (!user) {
      res.writeHead(HttpCode.NotFound)
      res.end()
      return
    }
    this.db = this.db.filter(el => el.id !== parameter)
    res.send(HttpCode.Delete , user)
  }

  setEndpoints() {
    this.emitter.on(this.path(METHOD.GET), this.getUser.bind(this))
    this.emitter.on(this.path(METHOD.POST), this.createUser.bind(this))
    this.emitter.on(this.path(METHOD.PUT), this.updateUser.bind(this))
    this.emitter.on(this.path(METHOD.DELETE), this.removeUser.bind(this))
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

      const [root = '', path = '', parameter] = req.url!.split('/').slice(1)
      const emit = this.emitter.emit(this.path(req.method!, root, path), req, res, parameter)
      
      if (!emit) {
        res.writeHead(HttpCode.NotFound)
        res.end()
      }
  
    })
  }
}