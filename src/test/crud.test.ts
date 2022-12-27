import { Server } from '../Server'
import request from 'supertest'
import http from 'http'

const testDB = JSON.stringify([{
  id: "f0222d8c-2ce1-4c36-a41e-3593d8c7c621",
  username: "Alex",  
  hobbies: [
    "game"
  ],
  age: 24
}])

const app = new Server()

describe('GET /users', function() {
  it('responds with json', async function() {
    try {
      const response = await request(app.server)
      .get('/api/users')
      .set('Accept', 'application/json')
        // expect(response.headers["Content-Type"]).toMatch(/json/);
        expect(response.status).toEqual(200);
        expect(response.text).toEqual(testDB)
    } finally {
      app.server.close()
    }
  });
});

// describe('Server', () => {
//   it('Get User / GET', async () => {
//     try {
//       const response = await request(app.server)
//         .get('http://localhost:4000/api/users')
//         //.set('Accept', 'application/json')
//       // expect(response.headers["Content-Type"]).toMatch(/json/);
//       // expect(response.status).toEqual(200)
//     } finally {
//       app.server.close()
//     }
//   });
  
      
  //   const response = await new Promise((resolve, reject) => {
  //     http.get('http://localhost:4000/api/users', (res) => {
  //       res.setEncoding('utf8');
  //       let rawData = '';
  //       res.on('data', (chunk) => { rawData += chunk; });
  //       res.on('end', () => resolve(rawData));
  //     }).on('error', (e) => reject(e));
  //   }).finally(() => server.server.close());
  //   expect(response).toBe(JSON.stringify([{
  //     id: "f0222d8c-2ce1-4c36-a41e-3593d8c7c621",
  //     username: "Alex",  
  //     hobbies: [
  //       "game"
  //     ],
  //     age: 24
  //   },
  // ]));
  //});
