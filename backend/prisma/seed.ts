import { PrismaClient, type filesystem } from '../generated/prisma'

const prisma = new PrismaClient()

async function main() {
	const text = new Uint8Array([
		35, 32, 87, 101, 108, 99, 111, 109, 101, 32, 116, 111, 32, 78, 111, 116,
		101, 32, 84, 114, 97, 99, 107, 101, 114, 32, 10, 10, 45, 32, 75, 101, 101,
		112, 32, 116, 114, 97, 99, 107, 32, 111, 102, 32, 121, 111, 117, 114, 32,
		116, 104, 111, 117, 103, 104, 116, 115, 32, 117, 115, 105, 110, 103, 32, 78,
		111, 116, 101, 32, 84, 97, 107, 101, 114, 33, 10, 45, 32, 65, 100, 100, 115,
		32, 115, 111, 109, 101, 32, 103, 105, 102, 115, 32, 97, 110, 100, 32, 109,
		101, 109, 101, 115, 32, 116, 111, 32, 109, 97, 107, 101, 32, 116, 104, 105,
		110, 103, 115, 32, 101, 118, 101, 110, 32, 102, 117, 110, 105, 101, 114, 46,
		10, 10, 32, 10, 33, 91, 105, 109, 97, 103, 101, 93, 40, 104, 116, 116, 112,
		115, 58, 47, 47, 109, 101, 100, 105, 97, 49, 46, 103, 105, 112, 104, 121,
		46, 99, 111, 109, 47, 109, 101, 100, 105, 97, 47, 118, 49, 46, 89, 50, 108,
		107, 80, 84, 99, 53, 77, 71, 73, 51, 78, 106, 69, 120, 79, 72, 66, 52, 90,
		110, 77, 48, 100, 50, 86, 49, 77, 50, 119, 49, 98, 109, 81, 121, 99, 122,
		90, 48, 100, 109, 108, 108, 78, 71, 108, 50, 98, 88, 112, 50, 77, 110, 90,
		115, 78, 51, 70, 51, 98, 110, 103, 51, 77, 109, 120, 110, 90, 105, 90, 108,
		99, 68, 49, 50, 77, 86, 57, 112, 98, 110, 82, 108, 99, 109, 53, 104, 98, 70,
		57, 110, 97, 87, 90, 102, 89, 110, 108, 102, 97, 87, 81, 109, 89, 51, 81,
		57, 90, 119, 47, 109, 103, 113, 101, 102, 113, 119, 83, 98, 84, 111, 80,
		101, 47, 103, 105, 112, 104, 121, 46, 103, 105, 102, 41, 10, 10, 10,
	])
	const data = new Blob([text], { type: 'text/plain' })

	await prisma.filesystem.create({
		data: {
			name: 'First-note.md',
			is_directory: false,
			path: 'Notes/first-note.md',
			updated_at: new Date(),
			size: data.size,
			data: await data.bytes(),
		},
	})

	const data2 = new Blob(['## Simple Note'], { type: 'text/plain' })
	await prisma.filesystem.create({
		data: {
			name: 'simple-note.md',
			is_directory: false,
			path: 'Notes/simple-note.md',
			updated_at: new Date(),
			size: data2.size,
			data: await data2.bytes(),
		},
	})

	await prisma.filesystem.create({
		data: {
			name: 'Notes',
			is_directory: true,
			path: 'Notes',
			updated_at: new Date(),
			data: undefined,
		},
	})
}

main()
	.catch((e) => {
		console.error('❌ Seed failed', e)
		process.exit(1)
	})
	.finally(() => prisma.$disconnect())
