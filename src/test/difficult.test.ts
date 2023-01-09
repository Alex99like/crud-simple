import { Server } from '../Server'
import request from 'supertest'
import { IUser } from '../helpers/user.interface'

interface IUserTest {
  username: string
  hobbies: string[]
  age: number
  id?: string
}

const testSend1: IUserTest = {
    username: "Loki",
    hobbies: [
        "jock"
    ],
    age: 20
}

const testSend2: IUserTest = {
    username: "Odin",
    hobbies: [
        "battle", "war"
    ],
    age: 100
}

const newSendTest = {
    username: "Old Odin",
    hobbies: [
        "world"
    ],
    age: 1920
}

const app = new Server()
const response = request(app.server)

describe('Server Crud', function() {

    let userID = ''
    let user2ID = ''

    it('POST / create user', async () => {
        const res1 = await response.post('/api/users')
            .set('Accept', 'application/json')
            .send(testSend1)
        expect(res1.status).toEqual(201);
        const user1 = JSON.parse(res1.text) as IUser
        userID = user1.id
        expect(user1.age).toBe(testSend1.age)
        expect(user1.username).toBe(testSend1.username)
        expect(user1.hobbies).toEqual(testSend1.hobbies)

        const res2 = await response.post('/api/users')
            .set('Accept', 'application/json')
            .send(testSend2)
        expect(res2.status).toEqual(201);
        const user2 = JSON.parse(res2.text) as IUser
        user2ID = user2.id
        expect(user2.age).toBe(testSend2.age)
        expect(user2.username).toBe(testSend2.username)
        expect(user2.hobbies).toEqual(testSend2.hobbies)

        testSend1.id = userID
        testSend2.id = user2ID
    })

    it('GET / get all users', async () => {
        const res = await response.get('/api/users')
            .set('Accept', 'application/json')
        expect(res.status).toEqual(200);
        expect(JSON.parse(res.text)).toEqual([testSend1, testSend2])
    });

    it('PUT / update user', async () => {
        const res = await response.put(`/api/users/${userID}`)
            .set('Accept', 'application/json')
            .send(newSendTest)

        const user = JSON.parse(res.text) as IUser
        expect(user.age).toBe(newSendTest.age)
        expect(user.username).toBe(newSendTest.username)
        expect(user.hobbies).toEqual(newSendTest.hobbies)
    })

    it('GET / get user by id', async  () => {
        const res = await response.get(`/api/users/${userID}`)

        const user = JSON.parse(res.text) as IUser
        expect(user.age).toBe(newSendTest.age)
        expect(user.username).toBe(newSendTest.username)
        expect(user.hobbies).toEqual(newSendTest.hobbies)
    })

    it('DELETE / remove user', async () => {
        const res = await response.delete(`/api/users/${userID}`)
            .set('Accept', 'application/json')

        expect(res.status).toEqual(204);
    })
});