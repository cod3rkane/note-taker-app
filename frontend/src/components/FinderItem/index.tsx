import {
	useRef,
	useEffect,
	useState,
	cloneElement,
	type FocusEvent,
	type MouseEvent as ReactMouseEvent,
	type KeyboardEvent,
} from 'react'
import classNames from 'classnames'
import type { FinderItemProps } from './types'
import styles from './styles.module.scss'
import { Observable } from 'windowed-observable'
import {
	type FinderEvent,
	FinderEvents,
	WindowEvents,
} from '../ContextProvider/types'

const finderObservable = new Observable(WindowEvents.FINDER_EVENTS)

export function FinderItem(props: FinderItemProps) {
	const [isHidden, setIsHidden] = useState(false)
	const [isShowingMenu, setIsShowingMenu] = useState(false)
	const [isEditing, setIsEditing] = useState(false)
	const ref = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const handleContextMenu = (event: MouseEvent) => {
			if (
				event.target === ref.current ||
				['ASIDE', 'aside'].includes((event.target as HTMLDivElement)?.nodeName)
			) {
				event.preventDefault()
			}

			if (event.target !== ref.current) {
				setIsShowingMenu(false)
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
	const onMouseDown = (event: ReactMouseEvent<HTMLDivElement, MouseEvent>) => {
		if (event.button === 0) return

		if (event.button === 2) {
			setIsShowingMenu(!isShowingMenu)
		} else {
			setIsShowingMenu(false)
		}
	}

	const menu = cloneElement(props.menu, {
		onClick: () => setIsShowingMenu(false),
		onRenameEvent: () => setIsEditing(true),
	})

	const onNameChangeBlur = (e: FocusEvent<HTMLInputElement>) => {
		e.preventDefault()
		e.stopPropagation()

		setIsEditing(false)
		let name = e.target.value

		if (!props.note.isDirectory) {
			if (!name.endsWith('.md')) {
				name = `${name}.md`
			}
		}

		const eventData: FinderEvent = {
			event: FinderEvents.RENAME,
			payload: {
				...props.note,
				name,
			},
		}

		finderObservable.publish(eventData)
	}
	const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			setIsEditing(false)
			let name = e.currentTarget.value

			if (!props.note.isDirectory) {
				if (!name.endsWith('.md')) {
					name = `${name}.md`
				}
			}

			const eventData: FinderEvent = {
				event: FinderEvents.RENAME,
				payload: {
					...props.note,
					name,
				},
			}

			finderObservable.publish(eventData)
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
			onMouseDown={onMouseDown}
		>
			<span>{icon}</span>
			{isEditing && (
				<input
					type="text"
					onKeyDown={onKeyDown}
					onBlur={onNameChangeBlur}
					defaultValue={props.note.name}
					onClick={(e) => {
						e.stopPropagation()
						e.preventDefault()
					}}
				/>
			)}
			{!isEditing && props.children}
			{isShowingMenu && menu}
		</div>
	)
}

export default FinderItem
