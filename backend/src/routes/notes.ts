import type { Request, Response } from 'express'

import type { filesystem } from '../../generated/prisma'
import { listFilesystem, createFilesystem } from '../services/filesystem'

export async function get(req: Request, res: Response) {
	const notes = await listFilesystem()

	res.json(notes)
}

export function remove(req: Request, res: Response) {}

export async function create(req: Request, res: Response) {
	console.log({ req })
	// const data = new Blob(file.data ? [file.data] : ['**default-note**'], {
	// 	type: 'text/plain',
	// })
	// const file: Omit<filesystem, 'id'> = {
	// 	name: file.name,
	// 	is_directory: file.is_directory,
	// 	path: file.path,
	// 	updated_at: new Date(),
	// 	size: data.size,
	// 	data: await data.bytes(),
	// }

	res.json({ success: true })
}

export function update(req: Request, res: Response) {}

export default {
	get,
	remove,
	create,
	update,
}
