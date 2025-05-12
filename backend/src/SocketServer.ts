import { Server as SocketServer } from 'socket.io'
import type { Socket } from 'socket.io'
import type { Server as HttpServer } from 'node:http'
import type { Server as HttpsServer } from 'node:https'

import type { FileSystemFinder } from './types'
import { debounce } from './debounce'

const startSocketServer = (httpServer: HttpServer | HttpsServer) => {
	const io: SocketServer = new SocketServer(httpServer, { cors: {} })

	const onConnection = async (socket: Socket) => {
		// Socket connection started
		console.log('Connection started with socket id: ' + socket.id)

		socket.on('JOIN_ROOM', (roomID: string) => {
			console.log(`JOIN_ROOM: client: ${socket.id}, roomID: ${roomID}`)
			/// for a Nth clients that wants to join specific room
			socket.join(roomID)

			socket.data = {
				roomID,
			}
		})

		socket.on(
			'UPDATE_NOTE',
			debounce((note: FileSystemFinder) => {
				console.log('UPDATE_NOTE', note)

				socket.data = {
					...socket.data,
					note,
				}

				if (socket.data.roomID) {
					io.to(socket.data.roomID).emit('SYNC_NOTE', note)
				}
			}, 1000),
		)

		socket.on('REQUEST_NOTE', (roomID: string) => {
			console.log('REQUEST_NOTE')

			io.to(roomID).emit('ON_REQUEST_NOTE')
		})

		socket.on('SAVE_NOTE', (note: FileSystemFinder) => {
			console.log('SAVE_NOTE', { note })
			// @TODO: save note to Database
		})
	}

	const onDisconnect = async (socket: Socket) => {
		console.log('Client disconnected:', socket)
	}

	io.on('connection', onConnection)
	// io.on('disconnect', onDisconnect)
}

export default startSocketServer
