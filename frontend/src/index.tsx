import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'

import App from './App'

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
			<RouterProvider router={router} />
		</React.StrictMode>,
	)
}
