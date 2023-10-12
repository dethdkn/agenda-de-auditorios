import {TipoEvento, Erro} from './mongoose'

export default (): Promise<TiposEventos[]> => {
	return new Promise(async (resolve, reject) => {
		const tipos = await TipoEvento.find()
			.sort({nome: 1})
			.catch((err) => {
				new Erro({
					erro: {
						info: 'Não foi possivel ler os tipos de eventos do banco de dados',
						err
					}
				}).save()
				return reject('Erro ao baixar tipos de eventos')
			})
		if (tipos) return resolve(tipos)
		return reject('Erro ao baixar tipos de eventos')
	})
}
