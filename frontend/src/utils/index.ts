import type { FileSystemFinder } from '../components/Finder/types'

export function getDirectory(file: FileSystemFinder): string {
	if (file.isDirectory) {
		return file.path
	}

	const extractFolderRegex = /^(.*?)(?=\/[^/]+\.md$)/gim
	const dir = extractFolderRegex.exec(file.path)

	return dir?.[0] ?? ''
}

export function newFolder(
	note: FileSystemFinder,
	noteList: Array<FileSystemFinder>,
) {
	const defaultName = 'new folder'
	const directory = getDirectory(note)
	const notes = Array.from(noteList)
	const hasNewFolder = notes.filter((n: FileSystemFinder) => {
		return n.path.startsWith(`${directory}/${defaultName}`)
	})
	const name =
		hasNewFolder.length > 0
			? `${defaultName}${hasNewFolder.length}`
			: `${defaultName}`
	const path = `${directory}/${name}`

	return {
		id: note.id,
		name,
		isDirectory: true,
		path,
		updatedAt: new Date(),
	}
}

export function newNote(
	note: FileSystemFinder,
	noteList: Array<FileSystemFinder>,
): FileSystemFinder {
	const directory = getDirectory(note)
	const defaultName = 'new note'
	const notes = Array.from(noteList)
	const hasNewNote = notes.filter((n: FileSystemFinder) => {
		return n.path.startsWith(`${directory}/${defaultName}`)
	})
	const name =
		hasNewNote.length > 0
			? `${defaultName}${hasNewNote.length}.md`
			: `${defaultName}.md`
	const path = `${directory}/${name}`
	const data = new Blob([`**${name}**`], { type: 'text/plain' })

	return {
		id: note.id,
		name,
		isDirectory: false, // File
		path,
		updatedAt: new Date(),
		size: data.size,
		data,
	}
}
