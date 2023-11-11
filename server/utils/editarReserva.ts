export default (
	id: string,
	status: 'Aguardando' | 'Aprovado' | 'Recusado' | 'Cancelado',
	aceitoPor: string,
	level: string,
	coord: string[],
): Promise<Reserva> => {
	return new Promise(async (resolve, reject) => {
		const reserva = await Reserva.findById(id).catch((err) => {
			new Erro({
				erro: {
					info: 'Não foi possivel ler a Reserva',
					err,
				},
			}).save()
			return reject('Erro ao baixar reserva')
		})
		if (reserva && (level === 'Administrador' || coord.includes(reserva.audCoord))) {
			reserva.status = status
			reserva.aceitoPor = aceitoPor
			await reserva.save().catch((err) => {
				new Erro({
					erro: {
						info: 'Não foi possivel salvar a reserva após editar',
						err,
					},
				}).save()
				return reject('Erro ao editar reserva')
			})
			return resolve(reserva)
		}
		return reject('Erro ao baixar reserva - ID ou Coordenação Inválidas')
	})
}
