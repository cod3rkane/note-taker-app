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

export default {
	getNotes,
}
