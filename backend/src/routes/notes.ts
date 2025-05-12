import type { Request, Response } from 'express'

import { listFilesystem } from '../services/filesystem'

export async function get(req: Request, res: Response) {
	const notes = await listFilesystem()

	res.send(JSON.stringify(notes))
}

export function remove(req: Request, res: Response) {}

export function create(req: Request, res: Response) {}

export function update(req: Request, res: Response) {}

export default {
	get,
	remove,
	create,
	update,
}
