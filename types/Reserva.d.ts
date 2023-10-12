declare global {
	interface Reserva {
		_id?: string
		audNome: string
		audCoord: string
		nomeEvento: string
		tipoEvento: string
		instResponsavel: string
		nomeResponsavel: string
		emailResponsavel: string
		telefoneResponsavel: string
		datas: {
			data: Date
			inicio: string
			fim: string
		}[]
		recursosAud: string[]
		descricao: string
		observacao?: string
		solicitadoPor: string
		aceitoPor?: string
		status: 'Aguardando' | 'Aprovado' | 'Recusado' | 'Cancelado'
	}
}

export {Reserva}
