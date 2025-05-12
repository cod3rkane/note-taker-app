import type { HTMLAttributes } from 'react'

export type FileSystemFinder = {
	id: number
	name: string
	isDirectory?: boolean
	path: string
	updatedAt: Date
	size?: number
	data?: Blob
	children?: FileSystemFinder[]
}

export type FinderProps = Readonly<
	{
		children?: React.ReactNode
		data: Array<FileSystemFinder>
	} & Pick<HTMLAttributes<HTMLDivElement>, 'className'>
>
