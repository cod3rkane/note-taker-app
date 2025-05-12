import type { FileSystemFinder } from '../components/Finder/types'

/** Gets all Notes from /notes API */
export async function getNotes() {
	// @TODO: URL comes from .env later on
	return fetch('http://localhost:3005/notes', {
		headers: {
			'Content-Type': 'application/json',
			// @TODO: Authentication?
		},
	})
}

/** Delete Note */
export async function removeNote(id: number) {
	// @TODO: URL comes from .env later on
	return fetch('http://localhost:3005/notes', {
		method: 'DELETE',
		body: JSON.stringify({
			id,
		}),
		headers: {
			'Content-Type': 'application/json',
			// @TODO: Authentication?
		},
	})
}

/** Updates Note */
export async function updateNote(note: FileSystemFinder) {
	const data = await note.data?.bytes()
	// @TODO: URL comes from .env later on
	return fetch('http://localhost:3005/notes', {
		method: 'PUT',
		body: JSON.stringify({
			...note,
			data,
		}),
		headers: {
			'Content-Type': 'application/json',
			// @TODO: Authentication?
		},
	})
}

export default {
	getNotes,
	removeNote,
	updateNote,
}
