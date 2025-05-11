export type ContextProviderProps = Readonly<{
	children: React.ReactNode
}>

export const WindowEvents = {
	SET_CURRENT_NOTE: 'SET_CURRENT_NOTE',
	UPDATE_CURRENT_NOTE: 'UPDATE_CURRENT_NOTE',
	WEBSOCKET_EVENTS: 'WEBSOCKET_EVENTS',
} as const

export const WebsocketEvents = {
	JOIN_ROOM: 'JOIN_ROOM',
	UPDATE_NOTE: 'UPDATE_NOTE',
	REQUEST_NOTE: 'REQUEST_NOTE',
	SAVE_NOTE: 'SAVE_NOTE',
	ON_SYNC_NOTE: 'SYNC_NOTE',
	ON_REQUEST_NOTE: 'ON_REQUEST_NOTE',
} as const

export type WebsocketObservableEvents = {
	event: keyof typeof WebsocketEvents
	/// @TODO: for now any
	payload: any
}
