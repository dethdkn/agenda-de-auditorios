export default (audCoord: string): Promise<Reserva[]> => {
	return new Promise(async (resolve, reject) => {
		const reservas = await Reserva.find(
			{ status: 'Aprovado', audCoord },
			{ observacao: 0, aceitoPor: 0, status: 0, _id: 0, __v: 0 },
		).catch((err) => {
			new Erro({
				erro: {
					info: 'Não foi possivel ler as reservas aprovadas do banco de dados',
					err,
				},
			}).save()
			return reject('Erro ao baixar reservas')
		})
		if (reservas)
			return resolve(reservas)
		return reject('Erro ao baixar reservas')
	})
}
