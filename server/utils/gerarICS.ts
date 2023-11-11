import { createEvents } from 'ics'

export default (reservas: Reserva[]): Promise<string> => {
	return new Promise((resolve, reject) => {
		const eventos: {
			title: string
			start: [number, number, number, number, number]
			duration: {
				hours?: number
				minutes: number
			}
			description?: string
			location: string
			geo: {
				lat: number
				lon: number
			}
		}[] = []
		for (const reserva of reservas) {
			for (const data of reserva.datas) {
				const [inicioHoras, inicioMinutos] = data.inicio.split(':').map(Number)
				const [fimHoras] = data.fim.split(':').map(Number)
				eventos.push({
					title: reserva.nomeEvento,
					start: [
						data.data.getFullYear(),
						data.data.getMonth() + 1,
						data.data.getDate(),
						inicioHoras,
						inicioMinutos,
					],
					duration: {
						hours: fimHoras - inicioHoras,
						minutes: 0,
					},
					description: reserva.descricao,
					location: reserva.audNome,
					geo: {
						lat: -22.9540696,
						lon: -43.1735944,
					},
				})
			}
		}

		if (eventos.length > 0) {
			const { error, value } = createEvents(eventos)
			if (error) {
				new Erro({
					erro: {
						info: 'Erro ao criar arquivo ics',
						error,
					},
				}).save()
				return reject('erro ao criar .ics')
			}
			if (value)
				return resolve(value)
			return reject('erro ao criar .ics')
		}
		return resolve('')
	})
}
