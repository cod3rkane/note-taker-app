import { createContext } from 'react'

import type { ContextAPI } from './types'

export const initialContext: ContextAPI = {
	notes: [],
	currentNote: undefined,
	isLoading: false,
}

export const NoteContext = createContext<ContextAPI>(initialContext)

export default NoteContext
