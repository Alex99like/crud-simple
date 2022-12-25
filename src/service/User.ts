import { v4, validate } from "uuid";
import { checkCreate, checkUpdate } from "../helpers/checkReq.js";
import { HttpCode, ReqType, ResType } from "../helpers/statusCode.js";
import { IUser } from "../helpers/user.interface.js";

export class UserService {
  getUser(req: ReqType, res: ResType, parameter: string, db: IUser[]) {
    if (parameter) {
      const [user] = db.filter(el => el.id === parameter)
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
      res.send(HttpCode.Success, db)
    }
  }

  createUser(req: ReqType, res: ResType, parameter: string, db: IUser[]) {
    if (parameter) {
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
            db.push({ id, username: user.username, age: user.age, hobbies: user.hobbies })
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

  updateUser(req: ReqType, res: ResType, parameter: string, db: IUser[]) {
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
          const index = db.findIndex(el => el.id === parameter)
          const prevItem = db[index] 
          const userItem = {
            id: user.id ? user.id : prevItem.id,
            username: user.username ? user.username : prevItem.username,
            age: user.age ? user.age : prevItem.age,
            hobbies: user.hobbies ? user.hobbies : prevItem.hobbies,
          }
          
          db.splice(index, 1, userItem)
          
          res.send(HttpCode.Success, userItem)

        } else {
          res.send(HttpCode.BadReq, { errors })
        }
      } catch(e) {
        res.send(HttpCode.ErrorServer, { message: `failed to update user` })
      }      
    })
  }

  removeUser(req: ReqType, res: ResType, parameter: string, db: IUser[]) {
    const userI = db.findIndex(el => el.id === parameter)
    if (!parameter) {
      res.send(HttpCode.BadReq, { message: `id not specified` })
      return
    } else if (!validate(parameter)) {
      res.send(HttpCode.NotFound, { message: `this Id: ${parameter} is not valid` })
      return
    }
    
    if (userI === -1) {
      res.send(HttpCode.BadReq, { message: `there is no user with this id` })
      return
    }
    
    db.splice(userI, 1)
    res.send(HttpCode.Delete , { message: `user with id: ${parameter} deleted` })
  }
}