declare global {
	interface Auditorio {
		_id?: string
		nome: string
		capacidade: string
		coordenacao: string
		itens: string[]
		descricao?: string
		url: string
		fotos: string[]
		planta?: string
	}
}

export {Auditorio}
