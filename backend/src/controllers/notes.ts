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
				data: n.data as Uint8Array,
			}

			return data
		})

		return result
	}

	public async createNote(file: FileSystemFinder & { data: Uint8Array }) {
		const arrayBuffer = new Uint8Array(file.data)
		const data = new Blob([arrayBuffer], { type: 'text/plain' })

		const result = await this.filesystem.createFilesystem({
			name: file.name,
			is_directory: Boolean(file.isDirectory),
			path: file.path,
			updated_at: new Date(),
			size: data.size,
			data: arrayBuffer,
		})

		if (result.id) {
			return {
				id: result.id,
				name: result.name,
				isDirectory: Boolean(result.is_directory),
				path: result.path,
				updatedAt: new Date(result.updated_at),
				size: result.size ?? undefined,
				data: result.data as Uint8Array,
			}
		}

		return result
	}

	public async updateNote(file: FileSystemFinder & { data: Uint8Array }) {
		const arrayBuffer = new Uint8Array(Object.values(file.data))
		const data = new Blob([arrayBuffer], { type: 'text/plain' })

		if (file.id) {
			const result = await this.filesystem.updateFileSystem({
				id: file.id,
				name: file.name,
				is_directory: Boolean(file.isDirectory),
				path: file.path,
				updated_at: new Date(),
				size: data.size,
				data: arrayBuffer,
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
