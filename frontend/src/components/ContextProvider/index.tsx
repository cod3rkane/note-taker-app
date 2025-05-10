import { useEffect, useState } from 'react'
import { Observable } from 'windowed-observable'

import { NoteContext, initialContext } from '../../context/noteContext'
import type { ContextProviderProps } from './types'
import { WindowEvents } from './types'
import type { FileSystemFinder } from '../Finder/types'

// @TODO: these namespaces needs to be a type
const observable = new Observable(WindowEvents.SET_CURRENT_NOTE)

export function ContextProvider(props: ContextProviderProps) {
	const [state, setState] = useState(initialContext)

	useEffect(() => {
		const onSetCurrentNoteEvent = (note: FileSystemFinder) => {
			setState({
				...state,
				currentNote: note,
			})
		}

		observable.subscribe(onSetCurrentNoteEvent)

		return () => {
			observable.unsubscribe(onSetCurrentNoteEvent)
		}
	})

	return (
		<NoteContext.Provider value={state}>{props.children}</NoteContext.Provider>
	)
}
