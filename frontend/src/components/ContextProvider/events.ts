import type { Dispatch, SetStateAction } from 'react'
import type { Socket } from 'socket.io-client'

import type { ContextAPI } from '../../context/types'
import type { FileSystemFinder } from '../Finder/types'
import {
	type FinderEvent,
	FinderEvents,
	WebsocketEvents,
	type WebsocketObservableEvents,
} from './types'
import { debounce } from '../../utils/debounce'
import { getDirectory } from '../../utils'
import API from '../../api'

export function emitJoinRoom(socket: Socket, state: ContextAPI) {
	return () => {
		socket.emit(WebsocketEvents.JOIN_ROOM, state.roomID)
	}
}

export function emitUpdateNote(socket: Socket, state: ContextAPI) {
	socket.emit(WebsocketEvents.UPDATE_NOTE, state.currentNote)

	if (state.currentNote) {
		API.updateNote(state.currentNote)
	}
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
		return n.path.startsWith(`${directory}/${defaultName}`)
	})

	const name =
		hasNewNote.length > 0
			? `${defaultName}${hasNewNote.length}.md`
			: `${defaultName}.md`
	const path = `${directory}/${name}`
	const data = new Blob([`**${name}**`], { type: 'text/plain' })
	const notes = Array.from(state.notes)

	const newNote: FileSystemFinder = {
		id: payload.id,
		name,
		isDirectory: false, // File
		path,
		updatedAt: new Date(),
		size: data.size,
		data,
	}

	notes.push(newNote)

	setState({
		...state,
		notes,
	})

	API.createNote(newNote)
		.then((res) => res.json())
		.then((note: FileSystemFinder & { data: Uint8Array }) => {
			if (note.data) {
				const arrayBuffer = new Uint8Array(Object.values(note.data))
				const blob = new Blob([arrayBuffer], { type: 'text/plain' })

				const noteIndex = notes.findIndex((n) => n.path === note.path)

				if (noteIndex !== -1) {
					notes[noteIndex] = {
						...note,
						data: blob,
					}

					setState({
						...state,
						notes,
					})
				}
			}
		})
}

export async function finderNewFolder(
	state: ContextAPI,
	setState: Dispatch<SetStateAction<ContextAPI>>,
	payload: FileSystemFinder,
) {
	const defaultName = 'new folder'
	const directory = getDirectory(payload)
	const hasNewFolder = state.notes.filter((n: FileSystemFinder) => {
		return n.path.startsWith(`${directory}/${defaultName}`)
	})

	const name =
		hasNewFolder.length > 0
			? `${defaultName}${hasNewFolder.length}`
			: `${defaultName}`
	const path = `${directory}/${name}`
	const notes = Array.from(state.notes)

	const newFolder: FileSystemFinder = {
		id: payload.id,
		name,
		isDirectory: true,
		path,
		updatedAt: new Date(),
	}

	notes.push(newFolder)

	setState({
		...state,
		notes,
	})

	API.createFolder(newFolder)
		.then(async (res) => await res.json())
		.then((folder: FileSystemFinder) => {
			if (folder.isDirectory) {
				const folderIndex = notes.findIndex((n) => n.path === folder.path)

				if (folderIndex !== -1) {
					notes[folderIndex] = {
						...folder,
					}

					setState({
						...state,
						notes,
					})
				}
			}
		})
}

export function finderDelete(
	state: ContextAPI,
	setState: Dispatch<SetStateAction<ContextAPI>>,
	payload: FileSystemFinder,
) {
	const directory = getDirectory(payload)
	const notes = Array.from(state.notes)

	if (payload.isDirectory) {
		setState({
			...state,
			notes: notes.filter((n) => !n.path.startsWith(directory)),
		})
	} else {
		setState({
			...state,
			notes: notes.filter((n) => n.path !== payload.path),
		})
	}

	API.removeNote(payload.id)
}

export function finderRename(
	state: ContextAPI,
	setState: Dispatch<SetStateAction<ContextAPI>>,
	payload: FileSystemFinder,
) {
	const directory = getDirectory(payload)
	const notes = Array.from(state.notes)
	const noteIndex = notes.findIndex((n) => n.path === payload.path)

	if (noteIndex !== -1) {
		const note = notes[noteIndex]

		const updatedNote: FileSystemFinder = {
			...note,
			name: payload.name,
			path: `${directory}/${payload.name}`,
		}

		notes[noteIndex] = updatedNote

		setState({
			...state,
			notes,
		})

		API.updateNote(updatedNote)
	}
}

export function finderObservableEventsHandler(
	state: ContextAPI,
	setState: Dispatch<SetStateAction<ContextAPI>>,
) {
	return debounce(({ event, payload }: FinderEvent) => {
		switch (event) {
			case FinderEvents.RENAME:
				return finderRename(state, setState, payload)
			case FinderEvents.NEW_FILE:
				return finderNewFile(state, setState, payload)
			case FinderEvents.NEW_FOLDER:
				return finderNewFolder(state, setState, payload)
			case FinderEvents.DELETE:
				return finderDelete(state, setState, payload)
		}
	}, 500)
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
