import type { HTMLAttributes } from 'react'

import type { FileSystemFinder } from '../Finder/types'

export type FinderItemProps = {
	children: React.ReactNode
	isFolder?: React.ReactNode
	note: FileSystemFinder
	onClickNote: (note: FileSystemFinder) => void
} & Pick<HTMLAttributes<HTMLDivElement>, 'className'>
