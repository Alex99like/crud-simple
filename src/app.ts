import { Server } from "./Server";
import { config } from 'dotenv'
config()

let port = process.env.PORT || 4000

const server = new Server()

server.listen(port, () => {
    console.log(`Server start: ${port}`)
})