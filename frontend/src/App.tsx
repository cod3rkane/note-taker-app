import { useState } from 'react'
import MDEditor from '@uiw/react-md-editor'

import Finder from './components/Finder'

import './app.css'
import './app.scss'

const App = () => {
	const [value, setValue] = useState('**Hello world!!!**')

	return (
		<main>
			<div className="flex">
				<Finder className="flex-1/6" />
				<section className="flex-5/6">
					<MDEditor value={value} onChange={setValue} height="100vh" />
				</section>
			</div>
		</main>
	)
}

export default App
