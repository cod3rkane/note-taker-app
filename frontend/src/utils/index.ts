import type { FileSystemFinder } from '../components/Finder/types'

export const extractFolderRegex = /^(.*?)(?=\/[^/]+\.md$)/gim

export function getDirectory(file: FileSystemFinder): string {
	if (file.isDirectory) {
		return file.path
	}

	const dir = extractFolderRegex.exec(file.path)

	return dir?.[0] ?? ''
}
