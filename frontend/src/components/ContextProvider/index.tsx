import { useEffect, useState } from 'react'
import { Observable } from 'windowed-observable'

import { NoteContext, initialContext } from '../../context/noteContext'
import type { ContextProviderProps } from './types'
import { WindowEvents } from './types'
import type { FileSystemFinder } from '../Finder/types'

const currentNoteObservable = new Observable(WindowEvents.SET_CURRENT_NOTE)
const updateCurrentNoteObservable = new Observable(
	WindowEvents.UPDATE_CURRENT_NOTE,
)

export function ContextProvider(props: ContextProviderProps) {
	const [state, setState] = useState(initialContext)

	useEffect(() => {
		const onSetCurrentNoteEvent = (note: FileSystemFinder) => {
			setState({
				...state,
				currentNote: note,
			})
		}
		const onUpdateCurrentNote = (text: string) => {
			// @TODO: just to test the events we're gonna update the currentNote only
			// @TODO: but once this is validated we can update current note and the Notes array with new data
			const currentNote = state.currentNote

			if (currentNote) {
				setState({
					...state,
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
		}
	})

	return (
		<NoteContext.Provider value={state}>{props.children}</NoteContext.Provider>
	)
}
