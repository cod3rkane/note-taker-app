import type { FileSystemFinder } from '../components/Finder/types'

export type ContextAPI = {
	notes: Array<FileSystemFinder>
	currentNote?: FileSystemFinder
	isLoading: boolean
}
