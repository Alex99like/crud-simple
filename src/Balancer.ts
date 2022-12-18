import os from 'os'
import cluster, { Worker } from 'cluster'
import http from 'http'

export class Balancer {
  cpus: number
  workers: Worker[]
  workCount: number
  server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>

  constructor() {
    this.cpus = os.cpus().length
    this.workers = []
    this.workCount = this.cpus - 2
    this.server = this.createServer()
    this.createWorks()
    this.exit()
  }

  listen(port: number, callback: () => void) {
    this.server.listen(port, callback)
  }

  exit() {
    process.on('SIGINT', () => {
      this.workers.forEach(worker => worker.kill())
    })
  }

  createWorks() {
    for (let i = 1; i < os.cpus().length; i++) {
      const worker = cluster.fork()
      this.workers.push(worker)
    }
  }

  createServer() {
    return http.createServer((req, res) => {
      this.workers[this.workCount].send(req.method!)
      this.workers[this.workCount].once('message', (data) => {
        res.end(data)
        if (this.workCount === 0) {
          this.workCount = os.cpus().length - 2
        } else {
          this.workCount -= 1
        }
      })
    })
  }
}