import { useState } from 'react'
import MDEditor from '@uiw/react-md-editor'

import Finder from './components/Finder'

import './app.css'
import './app.scss'

const App = () => {
	const [value, setValue] = useState('**Hello world!!!**')

	return (
		<main className="content">
			<div>
				<Finder />
				<section>
					<MDEditor value={value} onChange={setValue} />
				</section>
			</div>
		</main>
	)
}

export default App
