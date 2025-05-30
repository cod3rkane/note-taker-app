import type { FileSystemFinder } from '../Finder/types'

export type EditorProps = Readonly<{
	note?: FileSystemFinder
	onChange: (text: string) => void
}>
