import { Server } from '../Server'
import request from 'supertest'
import { IUser } from '../helpers/user.interface'

const testSend = {
  username: "Test",  
  hobbies: [
    "test"
  ],
  age: 99
}

const testSendUpdate = {
  username: "TestNew",  
  hobbies: [
    "test", "new"
  ],
  age: 9
}

const app = new Server()

describe('Server Crud', function() {
  const response = request(app.server)
  
  let createUser = ''

  it('GET / get all users', async () => {
     const res = await response.get('/api/users')
      .set('Accept', 'application/json')
        expect(res.status).toEqual(200);
        expect(JSON.parse(res.text)).toEqual([])
  });

  it('POST / create user', async () => {
    const res = await response.post('/api/users')
      .set('Accept', 'application/json')
      .send(testSend)
        expect(res.status).toEqual(201);
        const user = JSON.parse(res.text) as IUser
        createUser = user.id
        expect(user.age).toBe(testSend.age)
        expect(user.username).toBe(testSend.username)
        expect(user.hobbies).toEqual(testSend.hobbies)
  })

  it('GET / get user id', async () => {
    const res = await response.get(`/api/users/${createUser}`)
      .set('Accept', 'application/json')
        expect(res.status).toEqual(200);
        const user = JSON.parse(res.text) as IUser

        expect(user.age).toBe(testSend.age)
        expect(user.username).toBe(testSend.username)
        expect(user.hobbies).toEqual(testSend.hobbies)
  })

  it('PUT / update user', async () => {
    const res = await response.put(`/api/users/${createUser}`)
      .set('Accept', 'application/json')
      .send(testSendUpdate)

      const user = JSON.parse(res.text) as IUser
        expect(user.age).toBe(testSendUpdate.age)
        expect(user.username).toBe(testSendUpdate.username)
        expect(user.hobbies).toEqual(testSendUpdate.hobbies)
  })

  it('DELETE / remove user', async () => {
    const res = await response.delete(`/api/users/${createUser}`)
      .set('Accept', 'application/json')

      expect(res.status).toEqual(204);
  })
});
