import type { filesystem } from '../../generated/prisma'
import { FileSystem } from '../services/filesystem'

export class NotesController {
	private filesystem: FileSystem

	constructor() {
		this.filesystem = new FileSystem()
	}

	public async getAllNotes() {
		const notes = await this.filesystem.listFileSystems()

		return notes
	}

	public async createNote(file: Omit<filesystem, 'id'>) {
		const result = await this.filesystem.createFilesystem(file)

		return result
	}
}

export default NotesController
