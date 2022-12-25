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
    this.setEndpoints()
  }

  getUser(req: ReqType, res: ResType, parameter: string) {
    if (parameter) {
      const [user] = this.db.filter(el => el.id === parameter)
      if (user) {
        if (validate(user.id)) {
          res.send(HttpCode.Success, user)
        } else {
          res.send(HttpCode.BadReq, { message: `this Id: ${user.id} is not valid` })
        }
      } else {
        res.send(HttpCode.NotFound, { message: `there is no user with the same - ${parameter}` })
      }
    } else {
      res.send(HttpCode.Success, this.db)
    }
  }

  createUser(req: ReqType, res: ResType, parameter: string) {
    if (!parameter) {
      res.send(HttpCode.NotFound, { message: 'Not Found' })
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
            res.send(HttpCode.BadReq, { errors })
          }
        } catch(e) {
          res.send(HttpCode.ErrorServer, { message: `failed to create user` })
        }
      })
    }
  }

  updateUser(req: ReqType, res: ResType, parameter: string) {
    if (!parameter) {
      res.send(HttpCode.NotFound, { message: `Not Found: id not specified` })
      return
    } else if (!validate(parameter)) {
      res.send(HttpCode.NotFound, { message: `this Id: ${parameter} is not valid` })
      return
    }

    let body = ''
    req.on('data', (chunk) => {
      body += chunk
    })
    req.on('end', () => {
      try {
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
      } catch(e) {
        res.send(HttpCode.ErrorServer, { message: `failed to update user` })
      }      
    })
  }

  removeUser(req: ReqType, res: ResType, parameter: string) {
    if (!parameter) {
      res.send(HttpCode.BadReq, { message: `id not specified` })
      return
    }
    const [user] = this.db.filter(el => el.id === parameter)
    if (!user) {
      res.send(HttpCode.BadReq, { message: `there is no user with this id` })
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