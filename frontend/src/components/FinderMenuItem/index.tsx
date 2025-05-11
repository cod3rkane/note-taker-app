import classNames from 'classnames'
import { Observable } from 'windowed-observable'

import styles from './styles.module.scss'
import type { FinderMenuItemProps } from './types'
import { FinderEvents, WindowEvents } from '../ContextProvider/types'

const finderObservable = new Observable(WindowEvents.FINDER_EVENTS)

export function FinderMenuItem(props: FinderMenuItemProps) {
	const onClickNewFile = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
		e.stopPropagation()
		e.preventDefault()

		const event: FinderEvents = {
			event: FinderEvents.NEW_FILE,
			payload: props.finder,
		}

		finderObservable.publish(event)

		props.onClick?.()
	}
	const onClickNewFolder = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
		e.stopPropagation()
		e.preventDefault()

		const event: FinderEvents = {
			event: FinderEvents.NEW_FOLDER,
			payload: props.finder,
		}

		finderObservable.publish(event)

		props.onClick?.()
	}
	const onClickDelete = (e: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
		e.stopPropagation()
		e.preventDefault()

		const event: FinderEvents = {
			event: FinderEvents.DELETE,
			payload: props.finder,
		}

		finderObservable.publish(event)

		props.onClick?.()
	}

	return (
		<nav className={classNames(styles.FinderMenuItem, 'rounded-b-sm')}>
			<ul className="p-0.5">
				<li>Rename</li>
				<li onClick={onClickNewFile} onKeyDown={() => null}>
					New File
				</li>
				<li onClick={onClickNewFolder} onKeyDown={() => null}>
					New Folder
				</li>
				<li onClick={onClickDelete} onKeyDown={() => null}>
					Delete
				</li>
			</ul>
		</nav>
	)
}

export default FinderMenuItem
