declare global {
	interface UsuarioExterno {
		_id?: string
		email: string
		instituicao: string
		senha?: string
	}
}

export {UsuarioExterno}
