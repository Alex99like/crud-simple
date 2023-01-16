import { Server } from '../Server'
import request from 'supertest'
import { IUser } from '../helpers/user.interface'
import { MessageErr } from '../helpers/ErrorMessage'

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

describe('Server Error', () => {
  const response = request(app.server)

  it('GET / invalid id', async () => {
    const res = await response.get('/api/users/fdwefwe')
      .set('Accept', 'application/json')
        expect(res.status).toEqual(400);
        expect(JSON.parse(res.text)).toEqual(MessageErr.isNotValidID('fdwefwe'))
  })

  it('GET / no user id', async () => {
    const res = await response.get('/api/users/66fa2f02-6c25-4a6a-80db-791aeff152f0')
      .set('Accept', 'application/json')
        expect(res.status).toEqual(404);
        expect(JSON.parse(res.text)).toEqual(MessageErr.isNotUserID('66fa2f02-6c25-4a6a-80db-791aeff152f0'))
  })

  it('POST / no valid fields', async () => {
    const res = await response.post('/api/users')
      .send({ username: 'Alex' })
        expect(res.status).toEqual(400)
        expect((JSON.parse(res.text) as { errors: Array<IUser> }).errors.length).toBe(2)
  })

  it('POST / empty body', async () => {
    const res = await response.post('/api/users')
        expect(res.status).toEqual(400)
        expect(JSON.parse(res.text)).toEqual(MessageErr.failed('create'))
  })

  it('PUT / no valid id', async () => {
    const res = await response.put('/api/users/123456')
      expect(res.status).toEqual(400);
      expect(JSON.parse(res.text)).toEqual(MessageErr.isNotValidID('123456'))
  })

  it('PUT / no user id', async () => {
    const res = await response.put('/api/users/66fa2f02-6c25-4a6a-80db-791aeff152f0')
      expect(res.status).toEqual(404);
      expect(JSON.parse(res.text)).toEqual(MessageErr.isNotUserID('66fa2f02-6c25-4a6a-80db-791aeff152f0'))
  })

  it('PUT / no id', async () => {
    const res = await response.put('/api/users')
      expect(res.status).toEqual(404);
      expect(JSON.parse(res.text)).toEqual(MessageErr.notID)
  })
})