import type { Dispatch, SetStateAction } from 'react'
import type { FileSystemFinder } from '../components/Finder/types'

export type ContextAPI = {
	notes: Array<FileSystemFinder>
	currentNote?: FileSystemFinder
	isLoading: boolean
	roomID?: string
	updateCurrentNote?: (value: string) => void
	setContext?: Dispatch<SetStateAction<ContextAPI>>
}
