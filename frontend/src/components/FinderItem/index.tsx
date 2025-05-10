import { useState } from 'react'
import classNames from 'classnames'

import type { FinderItemProps } from './types'
import styles from './styles.module.scss'

export function FinderItem(props: FinderItemProps) {
	const [isHidden, setIsHidden] = useState(false)
	const icon = props.isFolder ? '📂' : '📄'
	const onClick = () => {
		if (props.isFolder) {
			setIsHidden(!isHidden)
		}
	}

	return (
		<div
			className={classNames(styles.finderItem, props.className, {
				[styles.hidden]: isHidden,
			})}
			onClick={onClick}
			onKeyDown={() => null}
		>
			<span>{icon}</span>
			{props.children}
		</div>
	)
}

export default FinderItem
