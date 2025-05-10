export type ContextProviderProps = Readonly<{
	children: React.ReactNode
}>

export const WindowEvents = {
	SET_CURRENT_NOTE: 'SET_CURRENT_NOTE',
	UPDATE_CURRENT_NOTE: 'UPDATE_CURRENT_NOTE',
} as const
