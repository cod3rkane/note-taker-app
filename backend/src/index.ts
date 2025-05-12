import express from 'express'
import cors from 'cors'
import type { Server as HttpServer } from 'node:http'
import { createServer as createHttpServer } from 'node:http'

import startSocketServer from './SocketServer'
import { NotesRoute } from './routes/notes'

const app = express()

app.use(cors())
app.use(express.json())

const httpServer: HttpServer = createHttpServer(app)

startSocketServer(httpServer)

const notesRouter = new NotesRoute(app)

notesRouter.init()

httpServer.listen(3005, () => {
	console.info(`Listening on 3005`)
})
