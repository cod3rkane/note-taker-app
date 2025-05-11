import classNames from 'classnames'
import { Observable } from 'windowed-observable'

import styles from './styles.module.scss'
import type { FinderMenuItemProps } from './types'
import {
	type FinderEvent,
	WindowEvents,
	FinderEvents,
} from '../ContextProvider/types'

const finderObservable = new Observable(WindowEvents.FINDER_EVENTS)

export function FinderMenuItem(props: FinderMenuItemProps) {
	const onClickEvent = (event: keyof typeof FinderEvents) => {
		return (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
			e.stopPropagation()
			e.preventDefault()

			const eventData: FinderEvent = {
				event,
				payload: props.finder,
			}

			finderObservable.publish(eventData)

			props.onClick?.()
		}
	}
	const onClickRename = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
		e.stopPropagation()
		e.preventDefault()

		props.onRenameEvent?.()
		props.onClick?.()
	}

	return (
		<nav className={classNames(styles.FinderMenuItem, 'rounded-b-sm')}>
			<ul className="p-0.5">
				<li onClick={onClickRename} onKeyDown={() => null}>
					Rename
				</li>
				<li
					onClick={onClickEvent(FinderEvents.NEW_FILE)}
					onKeyDown={() => null}
				>
					New File
				</li>
				<li
					onClick={onClickEvent(FinderEvents.NEW_FOLDER)}
					onKeyDown={() => null}
				>
					New Folder
				</li>
				<li onClick={onClickEvent(FinderEvents.DELETE)} onKeyDown={() => null}>
					Delete
				</li>
			</ul>
		</nav>
	)
}

export default FinderMenuItem
