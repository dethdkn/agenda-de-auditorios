export default (filtro: object): Promise<Reserva[]> => {
	return new Promise(async (resolve, reject) => {
		const reservas = await Reserva.find(filtro)
			.sort({ _id: -1 })
			.catch((err) => {
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
