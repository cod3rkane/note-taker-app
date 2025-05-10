import { useState, useContext, memo } from 'react'
import MDEditor from '@uiw/react-md-editor'

import { NoteContext } from './context/noteContext'
import Finder from './components/Finder'

import './app.css'
import './app.scss'

const FinderMemo = memo(Finder)

const App = () => {
	const notes = useContext(NoteContext)
	const [value, setValue] = useState('**Hello world!!!**')

	return (
		<main>
			<div className="flex">
				<FinderMemo className="flex-1/6" data={notes.notes} />
				<section className="flex-5/6">
					<MDEditor value={value} onChange={setValue} height="100vh" />
				</section>
			</div>
		</main>
	)
}

export default App
