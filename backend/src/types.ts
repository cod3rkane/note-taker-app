export type FileSystemFinder = {
	name: string
	isDirectory?: boolean
	path: string
	updatedAt: Date
	size?: number
	data?: Blob
	children?: FileSystemFinder[]
}
