import type { HTMLAttributes } from 'react'

import type { FinderMenuItemProps } from '../FinderMenuItem/types'
import type { FileSystemFinder } from '../Finder/types'

export type FinderItemProps = {
	children: React.ReactNode
	isFolder?: React.ReactNode
	note: FileSystemFinder
	onClickNote: (note: FileSystemFinder) => void
	menu: React.ReactElement<FinderMenuItemProps>
} & Pick<HTMLAttributes<HTMLDivElement>, 'className'>
