import type { Dispatch, SetStateAction } from 'react'
import type { Socket } from 'socket.io-client'

import type { ContextAPI } from '../../context/types'
import type { FileSystemFinder } from '../Finder/types'
import { WebsocketEvents, type WebsocketObservableEvents } from './types'
import { debounce } from '../../utils/debounce'

export function emitJoinRoom(socket: Socket, state: ContextAPI) {
	return () => {
		socket.emit(WebsocketEvents.JOIN_ROOM, state.roomID)
	}
}

export function emitUpdateNote(socket: Socket, state: ContextAPI) {
	socket.emit(WebsocketEvents.UPDATE_NOTE, state.currentNote)
}

export function emitRequestNote(socket: Socket, state: ContextAPI) {
	return () => {
		socket.emit(WebsocketEvents.REQUEST_NOTE, state.roomID)
	}
}

export function emitSaveNote(socket: Socket, state: ContextAPI) {
	return () => {
		socket.emit(WebsocketEvents.SAVE_NOTE, state.currentNote)
	}
}

export function onSyncNote(
	socket: Socket,
	state: ContextAPI,
	setState: Dispatch<SetStateAction<ContextAPI>>,
) {
	return debounce((note: FileSystemFinder & { data: ArrayBuffer }) => {
		const notes = state.notes
		const currentNote = state.currentNote

		if (note) {
			const noteIndex = notes.findIndex((n) => n.path === note.path)
			const bytes = new Blob([note.data], { type: 'text/plain' })

			notes[noteIndex] = {
				...note,
				data: bytes,
			}

			if (currentNote && currentNote.path === note.path) {
				currentNote.data = bytes
			}

			setState({
				...state,
				notes,
				currentNote,
			})
		}
	}, 1000)
}

export function onRequestNote(socket: Socket, state: ContextAPI) {
	return () => {
		emitUpdateNote(socket, state)
	}
}

export function websocketObservableEventsHandler(
	socket: Socket,
	state: ContextAPI,
) {
	return ({ event, payload }: WebsocketObservableEvents) => {
		switch (event) {
			case WebsocketEvents.JOIN_ROOM:
				emitJoinRoom(socket, state)
				break
			case WebsocketEvents.UPDATE_NOTE:
				emitUpdateNote(socket, state)
				break
			case WebsocketEvents.REQUEST_NOTE:
				emitRequestNote(socket, state)
				break
			case WebsocketEvents.SAVE_NOTE:
				emitSaveNote(socket, state)
				break
		}
	}
}

export default {
	onRequestNote,
	onSyncNote,
	emitSaveNote,
	emitRequestNote,
	emitUpdateNote,
	emitJoinRoom,
	websocketObservableEventsHandler,
}
