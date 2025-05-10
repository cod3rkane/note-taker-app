import { useContext, memo } from 'react'

import { NoteContext } from './context/noteContext'
import Finder from './components/Finder'
import { Editor } from './components/Editor'

import './app.css'
import './app.scss'

const FinderMemo = memo(Finder)
const EditorMemo = memo(Editor, (prevProps, nextProps) => {
	/// Here we only need to re-render Editor new a new Note is selected
	/// Otherwise we simply assume current buffer is always newer one
	// @TODO: later on we have to update this to take the websocket changes in
	if (prevProps.note?.path !== nextProps.note?.path) {
		return false
	}

	return true
})

export function App() {
	const notes = useContext(NoteContext)

	console.log({ notes })

	return (
		<main>
			<div className="flex">
				<FinderMemo className="flex-1/6" data={notes.notes} />
				<section className="flex-5/6">
					<EditorMemo note={notes.currentNote} />
				</section>
			</div>
		</main>
	)
}

export default App
