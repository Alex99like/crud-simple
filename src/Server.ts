import http from 'http'
import cluster from 'cluster'
import process from 'process'

export class Server {
  server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>
  port: undefined | number;

  constructor() {
    this.port = undefined;
    this.server = this.createServer()
    cluster.worker && this.handler()
  }

  listen(port: number, callback: () => void) {
    this.port = port
    this.server.listen(port, callback)
  }

  handler() {
    cluster.worker?.on('message', (msg) => {
      process.send && process.send(`${msg}: port: ${this.port}`)
    })
  }

  createServer() {
    return http.createServer((req, res) => {

    })
  }
}