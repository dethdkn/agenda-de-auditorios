declare global {
	interface TokenUsuario {
		idcbpf: string
		authenticated: boolean
		level: 'Administrador' | 'Gerente' | 'Secretária' | 'Técnico' | 'Externo' | ''
		coord: string[]
	}
}

export {TokenUsuario}
