import { PrismaClient, type filesystem } from '../../generated/prisma'

const prisma = new PrismaClient()

export async function listFilesystem() {
	const notes = await prisma.filesystem.findMany()

	prisma.$disconnect()

	return notes
}

export async function createFilesystem(file: filesystem) {
	const data = new Blob(['**default note**'])

	const res = await prisma.filesystem.create({
		data: {
			name: file.name,
			is_directory: file.is_directory,
			path: file.path,
			updated_at: new Date(),
			size: data.size,
			data: await data.bytes(),
		},
	})

	prisma.$disconnect()

	return res
}
