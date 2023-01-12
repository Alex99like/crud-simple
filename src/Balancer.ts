import os from 'os'
import cluster, { Worker } from 'cluster'
import http from 'http'
import { IUser } from './helpers/user.interface'
import { config } from 'dotenv'
config()

let port = process.env.PORT || 4000

export class Balancer {
  cpus: number
  workers: Worker[]
  workCount: number
  server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>
  db: IUser[]

  constructor() {
    this.cpus = os.cpus().length
    this.db = []
    this.workers = []
    this.workCount = 0
    this.server = this.createServer()
    this.createWorks()
    this.exit()
    this.listenWorkers()
  }

  listen(port: number, callback: () => void) {
    this.server.listen(port, callback)
  }

  exit() {
    process.on('SIGINT', () => {
      this.server.close()
      this.workers.forEach(worker => worker.kill())
    })
  }

  listenWorkers() {
    this.workers.forEach(worker => {
      worker.on('message', (data) => {
        this.workers.forEach(worker => {
          if (worker.id !== this.workCount) worker.send(data)
        })
      })
    })
  }

  createWorks() {
    for (let i = 0; i < os.cpus().length; i++) {
      const worker = cluster.fork()
      this.workers.push(worker)
    }
  }

  switchWorker() {
    const currentId = this.workers[this.workCount].id
    if (this.workers.length - 1 === this.workCount) {
      this.workCount = 0
    } else {
      this.workCount += 1
    } 

    return currentId
  }

  createServer() {
    return http.createServer((req, res) => {
      let body = ''
      req.on('data', (chunk) => {
        body += chunk
      })

      req.on('end', () => {

        const currentId = this.switchWorker()

        const request = http.request({
          host: 'localhost',
          port: +port + currentId,
          path: req.url,
          method: req.method,
          headers: {
            'balancer': 'true'
          }
        })

        request.on('error', () => {
          res.writeHead(500)
          res.end('Error Connect')
        })
        request.write(body)
        request.end()
        request.on('response', (resWorker) => {
          let body = ''
          resWorker.on('data', (chunk) => {
            body += chunk
          })
          resWorker.on('end', () => {
            res.statusCode = resWorker.statusCode!
            res.end(body)
          })
        })
      })
      
    })
  }
}