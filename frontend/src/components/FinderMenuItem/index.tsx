import classNames from 'classnames'

import styles from './styles.module.scss'
import type { FinderMenuItemProps } from './types'

export function FinderMenuItem(props: FinderMenuItemProps) {
	return (
		<nav className={classNames(styles.FinderMenuItem, 'rounded-b-sm')}>
			<ul className="p-0.5">
				<li>Rename</li>
				<li>New File</li>
				<li>New Folder</li>
				<li>Delete</li>
			</ul>
		</nav>
	)
}

export default FinderMenuItem
