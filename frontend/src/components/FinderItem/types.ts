import type { HTMLAttributes } from 'react'

export type FinderItemProps = {
	children: React.ReactNode
	isFolder?: React.ReactNode
} & Pick<HTMLAttributes<HTMLDivElement>, 'className'>
