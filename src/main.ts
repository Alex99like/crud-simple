import { Server } from './Server.js';
import { config } from 'dotenv'
config()
//import http from 'http'
//import cluster, { Worker } from 'cluster'
//import process from 'process'
//import os from 'os'
//import { Balancer } from './Balancer.js'
//import { METHOD } from './helpers/statusCode.js';

let port = process.env.PORT || 4000

const server = new Server()
server.listen(+port, () => {
  console.log(`Server Start: ${port}`)
})

// if (cluster.isPrimary) {
//   const balancer = new Balancer()

//   balancer.listen(port, () => {
//     console.log(`Balancer: ${port}`)
//   })
// } else {
//   const worker = new Server()

//   worker.listen(port + cluster.worker!.id, () => {
//     console.log(`Listen Port: ${port + cluster.worker!.id}`)
//   })
// }

