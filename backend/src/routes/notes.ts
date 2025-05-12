import type { Express, Request, Response } from 'express'

import { NotesController } from '../controllers/notes'

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

	private async remove(req: Request, res: Response) {}

	private async create(req: Request, res: Response) {}

	private async update(req: Request, res: Response) {}

	public init() {
		this.app.get('/notes', this.get.bind(this))
		this.app.post('/notes', this.create.bind(this))
		this.app.delete('/notes', this.remove.bind(this))
		this.app.put('/notes', this.update.bind(this))
	}
}

export default NotesRoute
