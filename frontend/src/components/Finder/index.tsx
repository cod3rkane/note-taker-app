import classNames from 'classnames'

import type { FinderProps } from './types'
import styles from './styles.module.scss'

export function Finder(props: FinderProps) {
	return (
		<aside className={classNames(styles.finder, props.className)}>
			<h2>Here</h2>
		</aside>
	)
}

export default Finder
