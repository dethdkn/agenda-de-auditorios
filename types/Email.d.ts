declare global {
	interface Email {
		_id?: string
		email: string
		auditorios: string[]
	}
}

export { Email }
