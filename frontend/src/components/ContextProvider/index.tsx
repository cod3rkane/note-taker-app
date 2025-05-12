import { useEffect, useState } from 'react'
import { Observable } from 'windowed-observable'
import { io } from 'socket.io-client'
import { useParams } from 'react-router'

import { NoteContext, initialContext } from '../../context/noteContext'
import type { ContextAPI } from '../../context/types'
import type { ContextProviderProps, FinderEvent } from './types'
import { FinderEvents, WebsocketEvents, WindowEvents } from './types'
import type { FileSystemFinder } from '../Finder/types'
import Events from './events'
import API from '../../api'
import { getDirectory, newFolder, newNote } from '../../utils'

const currentNoteObservable = new Observable(WindowEvents.SET_CURRENT_NOTE)
const finderObservable = new Observable(WindowEvents.FINDER_EVENTS)
const websocketObservable = new Observable(WindowEvents.WEBSOCKET_EVENTS)

// @TODO: this comes from .env later on
const socket = io('ws://localhost:3005')

export function ContextProvider(props: ContextProviderProps) {
	const [state, setState] = useState<ContextAPI>({
		...initialContext,
		isLoading: true,
	})
	const params = useParams<{ roomID?: string }>()

	console.log('roomID', params.roomID)
	console.info('Socket ID:', socket.id)

	const onUpdateCurrentNote = (text: string) => {
		const currentNote = state.currentNote

		if (currentNote) {
			const noteIndex = state.notes.findIndex(
				(n) => n.path === currentNote.path,
			)
			const notes = state.notes
			const data = new Blob([text], { type: 'text/plain' })

			if (noteIndex !== -1) {
				notes[noteIndex] = {
					...currentNote,
					data,
				}
			}

			const newState = {
				...state,
				notes,
				currentNote: {
					...currentNote,
					data,
				},
			}

			setState(newState)
			Events.emitUpdateNote(socket, newState)
		}
	}

	useEffect(() => {
		function finderHandlerEvents(payload: FinderEvent) {
			console.info('**finderHandlerEvents**')
			console.log({ payload })

			const directory = getDirectory(payload.payload)
			const notes = Array.from(state.notes)
			const fileSystem = payload.payload
			const noteIndex = notes.findIndex((n) => n.path === fileSystem.path)

			switch (payload.event) {
				case FinderEvents.NEW_FOLDER: {
					const note = newFolder(fileSystem, notes)

					notes.push(note)

					setState({
						...state,
						notes,
					})

					API.createFolder(note)
						.then(async (res) => await res.json())
						.then((folder: FileSystemFinder) => {
							if (folder.isDirectory) {
								const folderIndex = notes.findIndex(
									(n) => n.path === folder.path,
								)

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
					break
				}
				case FinderEvents.NEW_FILE: {
					const note = newNote(fileSystem, notes)

					notes.push(note)

					setState({
						...state,
						notes,
					})

					API.createNote(note)
						.then(async (res) => await res.json())
						.finally(console.info)
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
					break
				}
				case FinderEvents.RENAME:
					if (noteIndex !== -1) {
						const updatedNote: FileSystemFinder = {
							...notes[noteIndex],
							name: fileSystem.name,
							path: `${directory}/${fileSystem.name}`,
						}

						notes[noteIndex] = updatedNote

						setState({
							...state,
							notes,
						})

						/// Update BE
						API.updateNote(updatedNote)
					}
					break
				case FinderEvents.DELETE:
					setState({
						...state,
						notes: notes.filter((n) => {
							return fileSystem.isDirectory
								? !n.path.startsWith(directory)
								: n.path !== fileSystem.path
						}),
					})

					/// Update BE
					API.removeNote(fileSystem.id)
					break
			}
		}

		finderObservable.subscribe(finderHandlerEvents)

		return () => {
			finderObservable.unsubscribe(finderHandlerEvents)
		}
	}, [state])

	useEffect(() => {
		API.getNotes()
			.then((res) => res.json())
			.then((data: Array<FileSystemFinder & { data: Uint8Array }>) => {
				const notes = data.map((n: FileSystemFinder & { data: Uint8Array }) => {
					const arrayBuffer = new Uint8Array(Object.values(n.data))
					const blob = new Blob([arrayBuffer], { type: 'text/plain' })

					return {
						...n,
						data: blob,
					}
				})

				setState({
					notes,
					isLoading: false,
				})
			})
	}, [])

	useEffect(() => {
		const onSetCurrentNoteEvent = (note: FileSystemFinder) => {
			const noteIndex = state.notes.findIndex((n) => n.path === note.path)
			const notes = state.notes

			setState({
				...state,
				currentNote: notes[noteIndex],
			})
		}

		/// Window Events
		currentNoteObservable.subscribe(onSetCurrentNoteEvent)
		websocketObservable.subscribe(
			Events.websocketObservableEventsHandler(socket, state),
		)

		// Websocket Events
		socket.on(
			WebsocketEvents.ON_SYNC_NOTE,
			Events.onSyncNote(socket, state, setState),
		)
		socket.on(
			WebsocketEvents.ON_REQUEST_NOTE,
			Events.onRequestNote(socket, state),
		)

		return () => {
			/// Window Events
			currentNoteObservable.unsubscribe(onSetCurrentNoteEvent)

			// Websocket Events
			// @TODO: disconnect socket lateron
			// socket.disconnect()
		}
	})

	if (params.roomID) {
		socket.emit(WebsocketEvents.JOIN_ROOM, params.roomID)
	}

	return (
		<NoteContext
			value={{
				...state,
				updateCurrentNote: onUpdateCurrentNote,
				setContext: setState,
			}}
		>
			{props.children}
		</NoteContext>
	)
}
