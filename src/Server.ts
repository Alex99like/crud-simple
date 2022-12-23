import http from 'http'
import { UserService } from './service/User.js';
import { HttpCode, METHOD, ReqType, ResType } from './helpers/statusCode.js';
import { IUser } from './helpers/user.interface.js';
import EventEmitter from 'events'
import { checkReq } from './helpers/checkReq.js';
import { v4, validate } from 'uuid'
import { URL } from 'url'

// export class Server {
//   server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>
//   port: undefined | number;
//   service: UserService
//   db: IUser[]
//   emitter: EventEmitter;

//   constructor() {
//     this.port = undefined;
//     this.db = [{ age: 21, id: '21123', hobbies: [], username: 'Alex' }]
//     this.server = this.createServer()
//     this.emitter = new EventEmitter()
    
//     this.service = new UserService(this.db)
//     this.createEndpoints()
//   }

//   listen(port: number, callback: () => void) {
//     this.port = port
//     this.server.listen(port, callback)
//   }

//   createEndpoints() {
//     this.emitter.on(this.createPath(METHOD.GET), this.getUsers.bind(this))
//     this.emitter.on(this.createPath(METHOD.POST), this.createUser.bind(this))
//     this.emitter.on(this.createPath(METHOD.PUT), this.updateUser.bind(this))
//     this.emitter.on(this.createPath(METHOD.DELETE), this.deleteUser.bind(this))
//   }

//   getUsers(req: ReqType, res: ResType, parameter: string) {
//     if (parameter) {
//       const [user] = this.db.filter(el => el.id === parameter) 
//       if (user) {
//         res.writeHead(HttpCode.Success)
//         res.send(user)
//       } else {
//         res.writeHead(HttpCode.BadReq)
//         res.end()
//       }

//     } else {
//       res.send(this.db)
//     }
//   }

//   createUser(req: ReqType, res: ResType) {
    // let body = ''
    // req.on('data', (chunk) => {
    //   body += chunk
    // })
    // req.on('end', () => {
    //   const user = JSON.parse(body)
    //   const errors = checkReq(user)

    //   if (errors.length === 0) {
    //     this.db.push({ id: v4(), username: user.username, age: user.age, hobbies: user.hobbies })
    //     res.writeHead(HttpCode.Created)
    //     res.send(user)
    //   } else {
    //     res.writeHead(HttpCode.BadReq)
    //     res.send({ errors })
    //   }
    // })
//   }

//   updateUser(req: ReqType, res: ResType, parameter: string) {
//     if (parameter) {
//       const [user] = this.db.filter(el => el.id === parameter)
//       if (user) {
//         let body = ''
//         req.on('data', (chunk) => {
//           body += chunk
//         })
//         req.on('end', () => {
          
//         })
//       }
//     } else {
//       res.writeHead(HttpCode.NotFound)
//       res.end()
//     }
//   }

//   deleteUser(req: ReqType, res: ResType, parameter: string) {
//     if (!parameter) {
//       res.writeHead(HttpCode.NotFound)
//       res.end()
//     }

//     const [user] = this.db.filter(el => el.id === parameter)
//     this.db = this.db.filter(el => el.id !== parameter)
//     if (!user) {
//       res.writeHead(HttpCode.BadReq)
//     } else {
//       res.writeHead(HttpCode.Delete)
//     }
    
//     res.end()
//   }

//   createPath(method: string) {
//     return `api/users:${method}`
//   }

//   createServer() {
//     return http.createServer((req, res) => {
//       (res as ResType).send = (data) => {
//         res.end(JSON.stringify(data))
//       }

//       const [root, path, parameter] = req.url!.split('/').slice(1)

//       const emit = this.emitter.emit(`${root}/${path}:${req.method}`, req, res, parameter)
//       if (!emit) (res as ResType).send({message: HttpCode.NotFound })
//     })
//   }
// }

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
          res.send(user)
        } else {
          res.writeHead(HttpCode.BadReq)
          res.end()
        }
      } else {
        res.writeHead(HttpCode.NotFound)
        res.end()
      }
    } else {
      res.send(this.db)
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
        const user = JSON.parse(body)
        const errors = checkReq(user)

        if (errors.length === 0) {
          const id = v4()
          this.db.push({ id, username: user.username, age: user.age, hobbies: user.hobbies })
          res.writeHead(HttpCode.Created)
          res.send({ id, ...user })
        } else {
          res.writeHead(HttpCode.BadReq)
          res.send({ errors })
        }
      })
    }
  }

  setEndpoints() {
    this.emitter.on(this.path(METHOD.GET), this.getUser.bind(this))
    this.emitter.on(this.path(METHOD.POST), this.createUser.bind(this))
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

      (res as ResType).send = (data: any) => {
        res.writeHead(HttpCode.Success)
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