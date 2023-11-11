export default (
	audNome: string,
	audCoord: string,
	nomeEvento: string,
	tipoEvento: string,
	instResponsavel: string,
	nomeResponsavel: string,
	emailResponsavel: string,
	telefoneResponsavel: string,
	datas: { data: Date; inicio: string; fim: string }[],
	recursosAud: string[],
	solicitadoPor: string,
	status: 'Aguardando' | 'Aprovado',
	descricao?: string,
	observacao?: string,
	aceitoPor?: string,
): Promise<string> => {
	return new Promise(async (resolve, reject) => {
		const reserva = await new Reserva({
			audNome,
			audCoord,
			nomeEvento,
			tipoEvento,
			instResponsavel,
			nomeResponsavel,
			emailResponsavel,
			telefoneResponsavel,
			datas,
			recursosAud,
			solicitadoPor,
			status,
			descricao,
			observacao,
			aceitoPor,
		})
			.save()
			.catch((err) => {
				new Erro({
					erro: {
						info: 'Erro ao criar reserva',
						err,
					},
				}).save()
				return reject('Erro ao criar reserva')
			})
		if (reserva)
			resolve(reserva._id)
		resolve('')
	})
}
