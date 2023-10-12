declare global {
	interface UsuarioInterno {
		idcbpf: string
		nivel: 'Administrador' | 'Gerente' | 'Secretária' | 'Técnico' | ''
		coordenacao: string[]
	}
}

export {UsuarioInterno}
