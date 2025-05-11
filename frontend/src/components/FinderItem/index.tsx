import { useRef, useEffect, useState } from 'react'
import classNames from 'classnames'
import type { FinderItemProps } from './types'
import styles from './styles.module.scss'

export function FinderItem(props: FinderItemProps) {
	const [isHidden, setIsHidden] = useState(false)
	const ref = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const handleContextMenu = (event: MouseEvent) => {
			if (
				event.target === ref.current ||
				['ASIDE', 'aside'].includes((event.target as HTMLDivElement)?.nodeName)
			) {
				event.preventDefault()
			}
		}

		document.addEventListener('contextmenu', handleContextMenu)

		return () => {
			document.removeEventListener('contextmenu', handleContextMenu)
		}
	}, [])

	const icon = props.isFolder ? '📂' : '📄'
	const onClick = () => {
		if (props.isFolder) {
			setIsHidden(!isHidden)
		} else {
			props.onClickNote(props.note)
		}
	}

	return (
		<div
			ref={ref}
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
