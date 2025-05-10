import { useEffect, useState } from 'react'
import { Observable } from 'windowed-observable'
import { io } from 'socket.io-client'

import {
	NoteContext,
	initialContext,
	initialNotes,
} from '../../context/noteContext'
import type { ContextProviderProps } from './types'
import { WindowEvents } from './types'
import type { FileSystemFinder } from '../Finder/types'

const currentNoteObservable = new Observable(WindowEvents.SET_CURRENT_NOTE)
const updateCurrentNoteObservable = new Observable(
	WindowEvents.UPDATE_CURRENT_NOTE,
)

// @TODO: this comes from .env later on
const socket = io('ws://localhost:3005')

export function ContextProvider(props: ContextProviderProps) {
	const [state, setState] = useState({
		...initialContext,
		notes: initialNotes,
	})

	useEffect(() => {
		const onSetCurrentNoteEvent = (note: FileSystemFinder) => {
			const noteIndex = state.notes.findIndex((n) => n.path === note.path)
			const notes = state.notes

			setState({
				...state,
				currentNote: notes[noteIndex],
			})
		}
		const onUpdateCurrentNote = (text: string) => {
			const currentNote = state.currentNote

			if (currentNote) {
				const noteIndex = state.notes.findIndex(
					(n) => n.path === currentNote.path,
				)
				const notes = state.notes

				if (noteIndex !== -1) {
					notes[noteIndex] = currentNote
				}

				setState({
					...state,
					notes,
					currentNote: {
						...currentNote,
						data: new Blob([text], { type: 'text/plain' }),
					},
				})
			}
		}

		currentNoteObservable.subscribe(onSetCurrentNoteEvent)
		updateCurrentNoteObservable.subscribe(onUpdateCurrentNote)

		return () => {
			currentNoteObservable.unsubscribe(onSetCurrentNoteEvent)
			updateCurrentNoteObservable.unsubscribe(onUpdateCurrentNote)
			socket.disconnect()
		}
	})

	return (
		<NoteContext.Provider value={state}>{props.children}</NoteContext.Provider>
	)
}
