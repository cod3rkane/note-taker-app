import express from 'express'
import cors from 'cors'
import type { Server as HttpServer } from 'node:http'
import { createServer as createHttpServer } from 'node:http'

import startSocketServer from './SocketServer'

const app = express()

app.use(cors())
app.use(express.json())

let httpServer: HttpServer
httpServer = createHttpServer(app)

startSocketServer(httpServer)

httpServer.listen(3005, () => {
	console.info(`Listening on 3005`)
})
