import { useState } from 'react'
import MDEditor from '@uiw/react-md-editor'

import './app.scss'

const App = () => {
	const [value, setValue] = useState('**Hello world!!!**')

	return (
		<main className="content">
			<div>
				<section>
					<MDEditor value={value} onChange={setValue} />
				</section>
			</div>
		</main>
	)
}

export default App
