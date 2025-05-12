import { PrismaClient, type filesystem } from '../../generated/prisma'

export class FileSystem {
	private db: PrismaClient

	constructor() {
		this.db = new PrismaClient()
	}

	public async listFileSystems() {
		const notes = await this.db.filesystem.findMany()

		this.db.$disconnect()

		return notes
	}

	public async createFilesystem(file: Omit<filesystem, 'id'>) {
		const data = new Blob(file.data ? [file.data] : ['**default-note**'], {
			type: 'text/plain',
		})

		const res = await this.db.filesystem.create({
			data: {
				name: file.name,
				is_directory: file.is_directory,
				path: file.path,
				updated_at: new Date(),
				size: data.size,
				data: await data.bytes(),
			},
		})

		this.db.$disconnect()

		return res
	}

	public async updateFileSystem(file: filesystem) {
		const result = await this.db.filesystem.update({
			where: { id: file.id },
			data: file,
		})

		return result
	}

	public async deleteFileSystem(id: number) {
		const result = await this.db.filesystem.delete({
			where: { id },
		})

		return result
	}
}

export default FileSystem
