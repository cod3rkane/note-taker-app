import { defineConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'
import { pluginSass } from '@rsbuild/plugin-sass'

export default defineConfig({
	plugins: [pluginReact(), pluginSass()],
	html: {
		title: 'Note Taker',
		tags: [
			{
				tag: 'link',
				attrs: { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
			},
			{
				tag: 'link',
				attrs: {
					rel: 'preconnect',
					href: 'https://fonts.gstatic.com',
					crossorigin: true,
				},
			},
			{
				tag: 'link',
				attrs: {
					rel: 'stylesheet',
					href: 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap',
				},
			},
			{
				tag: 'link',
				attrs: {
					rel: 'stylesheet',
					href: 'https://fonts.googleapis.com/icon?family=Material+Icons',
				},
			},
		],
		// favicon: './src/assets/logo-b.webp',
		// appIcon: {
		// 	name: 'Canbet | Sports Betting',
		// 	icons: [
		// 		{ src: './src/assets/logo-b.webp', size: 192 },
		// 		{ src: './src/assets/logo-b.webp', size: 512 },
		// 	],
		// },
	},
})
