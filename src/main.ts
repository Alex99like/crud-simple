import { Server } from './Server.js';
import http from 'http'
import cluster, { Worker } from 'cluster'
import process from 'process'
import os from 'os'
import { Balancer } from './Balancer.js'

let port = 4000

if (cluster.isPrimary) {
  const balancer = new Balancer()

  balancer.listen(port, () => {
    console.log(`Balancer: ${port}`)
  })
} else {
  const worker = new Server()

  worker.listen(port + cluster.worker!.id, () => {
    console.log(`Listen Port: ${port + cluster.worker!.id}`)
  })
}

