import {Instituicao, Erro} from './mongoose'

export default (): Promise<Instituicoes[]> => {
	return new Promise(async (resolve, reject) => {
		const instituicoes = await Instituicao.find()
			.sort({nome: 1})
			.catch((err) => {
				new Erro({
					erro: {
						info: 'Não foi possivel ler as instituições',
						err
					}
				}).save()
				return reject('Erro ao baixar instituições')
			})
		if (instituicoes) return resolve(instituicoes)
		return reject('Erro ao baixar instituições')
	})
}
