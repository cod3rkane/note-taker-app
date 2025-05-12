export type FileSystemFinder = {
	id?: number
	name: string
	isDirectory?: boolean
	path: string
	updatedAt: Date
	size?: number
	data?: Blob
}
