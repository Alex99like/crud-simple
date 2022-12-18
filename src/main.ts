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
  // const workers: Worker[] = []

  // for (let i = 1; i < os.cpus().length; i++) {
  //   const worker = cluster.fork()
  //   workers.push(worker)
  // }

  // let workCount = os.cpus().length - 2

  // const balancer = http.createServer((req, res) => {
  //   workers[workCount].send(req.method!)
  //   workers[workCount].once('message', (data) => {
  //     res.end(data)
  //     if (workCount === 0) {
  //       workCount = os.cpus().length - 2
  //     } else {
  //       workCount -= 1
  //     }
  //   })
  // })

  // balancer.listen(4000, () => {
  //   console.log(`Listen Master: ${4000}`)
  // })

} else {
  const worker = http.createServer((req, res) => {
  
    
    res.end('Work')
  })

  worker.listen(port + cluster.worker!.id, () => {
    console.log(`Listening port ${port + cluster.worker!.id}`);
  });

  cluster.worker?.on('message', (msg) => {
    process.send!(`${msg}: ${port + cluster.worker!.id}`)
    console.log(`${msg}: ${port + cluster.worker!.id}`)
  })
}

