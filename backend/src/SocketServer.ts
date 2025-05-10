import { Server as SocketServer } from 'socket.io'
import type { Socket } from 'socket.io'
import type { Server as HttpServer } from 'node:http'
import type { Server as HttpsServer } from 'node:https'

const startSocketServer = (httpServer: HttpServer | HttpsServer) => {
	const io: SocketServer = new SocketServer(httpServer, { cors: {} })

	const onConnection = async (socket: Socket) => {
		// Socket connection started
		console.log('Connection started with socket id: ' + socket.id)
	}

	io.on('connection', onConnection)
}

export default startSocketServer
