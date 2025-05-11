import type { Dispatch, SetStateAction } from 'react'
import type { Socket } from 'socket.io-client'

import type { ContextAPI } from '../../context/types'
import type { FileSystemFinder } from '../Finder/types'
import {
	FinderEvents,
	WebsocketEvents,
	type WebsocketObservableEvents,
} from './types'
import { debounce } from '../../utils/debounce'
import { getDirectory } from '../../utils'

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

export function finderNewFile(
	state: ContextAPI,
	setState: Dispatch<SetStateAction<ContextAPI>>,
	payload: FileSystemFinder,
) {
	const defaultName = 'new note'
	const directory = getDirectory(payload)
	const hasNewNote = state.notes.filter((n: FileSystemFinder) => {
		return n.path.startsWith(`${directory}/${defaultName}.md`)
	})

	console.log({ payload })
	console.log({ directory, hasNewNote })

	const name =
		hasNewNote.length > 0
			? `${defaultName}${hasNewNote.length}.md`
			: `${defaultName}.md`
	const path = `${directory}/${name}`
	const data = new Blob([`**${name}**`], { type: 'text/plain' })
	const notes = Array.from(state.notes)

	console.log({ name, path, data, notes })

	notes.push({
		name,
		isDirectory: false, // File
		path,
		updatedAt: new Date(),
		size: data.size,
		data,
	})

	console.log('here cod3rkane', { notes })

	setState({
		...state,
		notes,
	})
}

export function finderObservableEventsHandler(
	state: ContextAPI,
	setState: Dispatch<SetStateAction<ContextAPI>>,
) {
	return ({ event, payload }: FinderEvents) => {
		switch (event) {
			case FinderEvents.NEW_FILE:
				return finderNewFile(state, setState, payload)
			case FinderEvents.NEW_FOLDER:
				break
			case FinderEvents.DELETE:
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
	finderNewFile,
	finderObservableEventsHandler,
}
