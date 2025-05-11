import type { FileSystemFinder } from '../Finder/types'

export type FinderMenuItemProps = Readonly<{
	finder: FileSystemFinder
	onClick?: () => void
	onRenameEvent?: () => void
}>
