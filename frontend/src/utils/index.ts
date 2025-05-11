import type { FileSystemFinder } from '../components/Finder/types'

export function getDirectory(file: FileSystemFinder): string {
	if (file.isDirectory) {
		return file.path
	}

	const extractFolderRegex = /^(.*?)(?=\/[^/]+\.md$)/gim
	const dir = extractFolderRegex.exec(file.path)

	return dir?.[0] ?? ''
}
