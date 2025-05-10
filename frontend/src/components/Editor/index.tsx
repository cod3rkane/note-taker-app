import { Observable } from 'windowed-observable'
import { Suspense, useState, useEffect } from 'react'
import MDEditor from '@uiw/react-md-editor'

import { WindowEvents } from '../ContextProvider/types'
import type { EditorProps } from './types'
import { EditorSkeleton } from './EditorSkeleton'
import { debounce } from '../../utils/debounce'

const observable = new Observable(WindowEvents.UPDATE_CURRENT_NOTE)

export function Editor(props: EditorProps) {
	const [text, setText] = useState('')

	useEffect(() => {
		if (props?.note?.data) {
			props.note.data.text().then(setText)
		}
	}, [props.note])

	const onUpdate = debounce(() => {
		observable.publish(text)
	}, 2000)

	const onChange = (
		value?: string,
		_event?: React.ChangeEvent<HTMLTextAreaElement>,
	) => {
		if (value) {
			setText(value)

			onUpdate()
		}
	}

	return (
		<Suspense fallback={<EditorSkeleton />}>
			<MDEditor value={text} onChange={onChange} height="100vh" />
		</Suspense>
	)
}

export default Editor
