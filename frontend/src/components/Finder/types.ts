import type { HTMLAttributes } from 'react'

export type FinderProps = Readonly<
	{
		children?: React.ReactNode
	} & Pick<HTMLAttributes<HTMLDivElement>, 'className'>
>
