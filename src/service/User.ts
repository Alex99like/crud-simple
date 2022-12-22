import { ReqType, ResType } from "../helpers/statusCode.js";
import { IUser } from "../helpers/user.interface.js";

export class UserService {
  db: IUser[]

  constructor(db: IUser[]) {
    this.db = db
  }
  update(req: ReqType, res: ResType) {
    
  }  

  delete(req: ReqType, res: ResType) {}

  create(req: ReqType, res: ResType) {}

  get(req: ReqType, res: ResType, db: IUser[]) {
    res.send(db)
  }
}