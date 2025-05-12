import type { filesystem } from '../../generated/prisma'
import { FileSystem } from '../services/filesystem'
import type { FileSystemFinder } from '../types'

export class NotesController {
	private filesystem: FileSystem

	constructor() {
		this.filesystem = new FileSystem()
	}

	public async getAllNotes() {
		const notes = await this.filesystem.listFileSystems()
		const result = notes.map((n) => {
			const data = {
				id: n.id,
				name: n.name,
				isDirectory: Boolean(n.is_directory),
				path: n.path,
				updatedAt: new Date(n.updated_at),
				size: n.size ?? undefined,
				data: n.data,
			}

			return data
		})

		return result
	}

	public async createNote(file: FileSystemFinder) {
		const data = new Blob(file.data ? [file.data] : ['**default-note**'], {
			type: 'text/plain',
		})

		const result = await this.filesystem.createFilesystem({
			name: file.name,
			is_directory: Boolean(file.isDirectory),
			path: file.path,
			updated_at: new Date(),
			size: data.size,
			data: await data.bytes(),
		})

		return result
	}

	public async updateNote(file: FileSystemFinder) {
		const data = new Blob(file.data ? [file.data] : ['**default-note**'], {
			type: 'text/plain',
		})

		if (file.id) {
			const result = await this.filesystem.updateFileSystem({
				id: file.id,
				name: file.name,
				is_directory: Boolean(file.isDirectory),
				path: file.path,
				updated_at: new Date(),
				size: data.size,
				data: await data.bytes(),
			})

			return result
		}

		throw new Error('ID is required')
	}

	public async deleteNote(id: number) {
		const result = await this.filesystem.deleteFileSystem(id)

		return result
	}
}

export default NotesController
