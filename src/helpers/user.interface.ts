import { v4 } from 'uuid'

export interface IUser {
  id: string
  username: string
  age: number
  hobbies: string[]
}