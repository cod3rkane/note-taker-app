import { useEffect, useState } from 'react'
import { Observable } from 'windowed-observable'
import { io } from 'socket.io-client'
import { useParams } from 'react-router'

import {
	NoteContext,
	initialContext,
	initialNotes,
} from '../../context/noteContext'
import type { ContextAPI } from '../../context/types'
import type { ContextProviderProps } from './types'
import { WebsocketEvents, WindowEvents } from './types'
import type { FileSystemFinder } from '../Finder/types'
import Events from './events'

const currentNoteObservable = new Observable(WindowEvents.SET_CURRENT_NOTE)
const websocketObservable = new Observable(WindowEvents.WEBSOCKET_EVENTS)

// @TODO: this comes from .env later on
const socket = io('ws://localhost:3005')

export function ContextProvider(props: ContextProviderProps) {
	const [state, setState] = useState<ContextAPI>({
		...initialContext,
		notes: initialNotes,
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
			websocketObservable.unsubscribe(
				Events.websocketObservableEventsHandler(socket, state),
			)

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
