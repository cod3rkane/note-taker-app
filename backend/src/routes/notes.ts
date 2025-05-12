import type { Express, Request, Response } from 'express'

import { NotesController } from '../controllers/notes'
import type { FileSystemFinder } from '../types'

export class NotesRoute {
	private app: Express
	private controller: NotesController

	constructor(app: Express) {
		this.app = app
		this.controller = new NotesController()
	}

	private async get(req: Request, res: Response) {
		const notes = await this.controller.getAllNotes()

		res.json(notes)
	}

	private async remove(req: Request, res: Response) {
		const body: { id: number } = req.body

		const result = await this.controller.deleteNote(body.id)

		res.json(result)
	}

	private async create(req: Request, res: Response) {
		const file: FileSystemFinder = req.body

		const result = await this.controller.createNote(file)

		res.json(result)
	}

	private async update(req: Request, res: Response) {
		const file: FileSystemFinder = req.body

		const result = await this.controller.updateNote(file)

		res.json(result)
	}

	public init() {
		this.app.get('/notes', this.get.bind(this))
		this.app.post('/notes', this.create.bind(this))
		this.app.delete('/notes', this.remove.bind(this))
		this.app.put('/notes', this.update.bind(this))
	}
}

export default NotesRoute
