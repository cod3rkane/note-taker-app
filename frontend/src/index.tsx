import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'

import App from './App'
import { ContextProvider } from './components/ContextProvider'

const router = createBrowserRouter([
	{
		path: '/',
		element: <App />,
	},
])

const rootEl = document.getElementById('root')
if (rootEl) {
	const root = ReactDOM.createRoot(rootEl)

	root.render(
		<React.StrictMode>
			<ContextProvider>
				<RouterProvider router={router} />
			</ContextProvider>
		</React.StrictMode>,
	)
}
