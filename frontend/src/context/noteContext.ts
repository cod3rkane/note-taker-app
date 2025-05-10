import { createContext } from 'react'

import type { ContextAPI } from './types'
import type { FileSystemFinder } from '../components/Finder/types'

export const initialNotes: Array<FileSystemFinder> = [
	{
		name: 'Notes',
		isDirectory: true, // Folder
		path: '/Notes', // Located in Root directory
		updatedAt: new Date('2025-09-09T10:30:00Z'), // Last updated time
	},
	{
		name: 'first-note.md',
		isDirectory: false, // File
		path: '/Notes/first-note.md', // Located inside the "Pictures" folder
		updatedAt: new Date('2025-09-09T10:30:00Z'), // Last updated time
		size: 2048, // File size in bytes (example: 2 KB)
		data: new Blob(['**first-note**'], { type: 'text/plain' }),
	},
	{
		name: 'second-note.md',
		isDirectory: false, // File
		path: '/Notes/second-note.md', // Located inside the "Pictures" folder
		updatedAt: new Date('2025-09-09T10:30:00Z'), // Last updated time
		size: 2048, // File size in bytes (example: 2 KB)
		data: new Blob(['**second-note**'], { type: 'text/plain' }),
	},
	{
		name: 'Notes B',
		isDirectory: true, // Folder
		path: '/Notes/B', // Located in Root directory
		updatedAt: new Date('2025-09-09T10:30:00Z'), // Last updated time
	},
	{
		name: 'first-note-b.md',
		isDirectory: false, // File
		path: '/Notes/B/first-note-b.md', // Located inside the "Pictures" folder
		updatedAt: new Date('2025-09-09T10:30:00Z'), // Last updated time
		size: 2048, // File size in bytes (example: 2 KB)
		data: new Blob(['**first-note-b**'], { type: 'text/plain' }),
	},
	{
		name: 'Thoughts',
		isDirectory: true, // Folder
		path: '/Thoughts', // Located in Root directory
		updatedAt: new Date('2025-09-09T10:30:00Z'), // Last updated time
	},
	{
		name: 'first-thought.md',
		isDirectory: false, // File
		path: '/Thoughts/first-thought.md', // Located inside the "Pictures" folder
		updatedAt: new Date('2025-09-09T10:30:00Z'), // Last updated time
		size: 2048, // File size in bytes (example: 2 KB)
		data: new Blob(['**first-thought**'], { type: 'text/plain' }),
	},
]

export const initialContext: ContextAPI = {
	notes: initialNotes,
	currentNote: undefined,
	isLoading: false,
}

export const NoteContext = createContext<ContextAPI>(initialContext)

export default NoteContext
