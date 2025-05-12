import { PrismaClient, type filesystem } from '../generated/prisma'

const prisma = new PrismaClient()

async function main() {
	const text =
		'# Welcome to Note Tracker ![image](https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHB4ZnM0d2V1M2w1bmQyczZ0dmllNGl2bXp2MnZsN3F3bng3MmxnZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/mgqefqwSbToPe/giphy.gif)'
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
