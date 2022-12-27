import { Server } from './Server';
import { config } from 'dotenv'
config()
import cluster from 'cluster'
import { Balancer } from './Balancer'

let port = process.env.PORT || 4000

if (cluster.isPrimary) {
  const balancer = new Balancer()

  balancer.listen(+port, () => {
    console.log(`Balancer: ${port}`)
  })
} else {
  const worker = new Server()

  worker.listen(+port + cluster.worker!.id, () => {
    console.log(`Listen Port: ${+port + cluster.worker!.id}`)
  })
}

