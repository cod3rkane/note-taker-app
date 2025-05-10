import { useState } from 'react'
import classNames from 'classnames'

import FinderItem from '../FinderItem'

import type { FileSystemFinder, FinderProps } from './types'
import styles from './styles.module.scss'

export function organizer(data: Array<FileSystemFinder>) {
	const pathMap = new Map<string, FileSystemFinder>()

	for (const item of data) {
		pathMap.set(item.path, {
			...item,
			children: item.isDirectory ? [] : undefined,
		})
	}

	const roots: Array<FileSystemFinder> = []

	for (const item of data) {
		const parentPath = item.path.substring(0, item.path.lastIndexOf('/')) || '/'

		if (parentPath === item.path || !pathMap.has(parentPath)) {
			roots.push(pathMap.get(item.path))
		} else {
			const parent = pathMap.get(parentPath)

			if (parent.isDirectory) {
				parent.children!.push(pathMap.get(item.path))
			}
		}
	}

	return roots
}

export function renderTree(data: Array<FileSystemFinder>) {
	const sorted = data.sort((a, b) => {
		if (a.isDirectory && !b.isDirectory) return -1
		if (!a.isDirectory && b.isDirectory) return -2

		return a.name.localeCompare(b.name)
	})

	return (
		<ul>
			{sorted.map((node) => (
				<li key={node.path}>
					<FinderItem isFolder={node.isDirectory}>{node.name}</FinderItem>
					{node.isDirectory && node.children && renderTree(node.children)}
				</li>
			))}
		</ul>
	)
}

export function Finder(props: FinderProps) {
	const data = organizer(props.data)

	return (
		<aside className={classNames(styles.finder, props.className)}>
			<div className="p-4">{renderTree(data)}</div>
		</aside>
	)
}

export default Finder
