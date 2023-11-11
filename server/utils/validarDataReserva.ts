export default (
	datasSelecionadas: { data: Date; inicio: string; fim: string }[],
	auditorio: string,
): Promise<boolean> => {
	return new Promise(async (resolve, reject) => {
		for (const dataSelecionada of datasSelecionadas) {
			const reservas = await Reserva.find({
				'audNome': auditorio,
				'status': { $in: ['Aguardando', 'Aprovado'] },
				'datas.data': dataSelecionada.data,
			}).catch((err) => {
				new Erro({
					erro: {
						info: 'Não foi possivel ler as reservas aprovadas para esta data do banco de dados',
						err,
					},
				}).save()
				return reject('Erro ao baixar reservas')
			})
			if (reservas && reservas.length > 0) {
				for (const reserva of reservas) {
					for (const dataReserva of reserva.datas) {
						if (dataReserva.data.getTime() === dataSelecionada.data.getTime()) {
							if (
								(dataSelecionada.inicio > dataReserva.inicio
									&& dataSelecionada.inicio < dataReserva.fim)
								|| (dataSelecionada.fim > dataReserva.inicio
									&& dataSelecionada.fim < dataReserva.fim)
								|| dataSelecionada.inicio === dataReserva.inicio
								|| dataSelecionada.fim === dataReserva.fim
								|| (dataSelecionada.inicio < dataReserva.inicio
									&& dataSelecionada.fim > dataReserva.fim)
							) {
								return reject(
									`Já existe uma reserva marcada para o dia ${dataSelecionada.data.toLocaleDateString(
										'pt-br',
									)} das ${dataSelecionada.inicio} às ${dataSelecionada.fim}`,
								)
							}
						}
					}
				}
			}
		}
		return resolve(true)
	})
}
