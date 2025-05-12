import { useContext, memo } from 'react'

import { NoteContext } from './context/noteContext'
import Finder from './components/Finder'
import { Editor } from './components/Editor'

import './app.css'
import './app.scss'

const FinderMemo = memo(Finder)
const EditorMemo = memo(Editor)

export function App() {
	const context = useContext(NoteContext)

	const onEditorChange = (text: string) => {
		context.updateCurrentNote?.(text)
	}

	return (
		<main>
			<div className="flex">
				<FinderMemo className="flex-1/6" data={context.notes} />
				<section className="flex-5/6">
					<EditorMemo note={context.currentNote} onChange={onEditorChange} />
				</section>
			</div>
		</main>
	)
}

export default App
