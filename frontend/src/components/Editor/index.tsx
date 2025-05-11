import { Suspense, useState, useEffect } from 'react'
import MDEditor from '@uiw/react-md-editor'

import type { EditorProps } from './types'
import { EditorSkeleton } from './EditorSkeleton'

export function Editor(props: EditorProps) {
	const [text, setText] = useState('')

	useEffect(() => {
		if (props?.note?.data) {
			props.note.data.text().then(setText)
		}
	}, [props.note?.data])

	const onChange = (
		value?: string,
		_event?: React.ChangeEvent<HTMLTextAreaElement>,
	) => {
		if (value) {
			setText(value)

			props.onChange(value)
		}
	}

	return (
		<Suspense fallback={<EditorSkeleton />}>
			<MDEditor value={text} onChange={onChange} height="100vh" />
		</Suspense>
	)
}

export default Editor
