import {Auditorio, Erro} from './mongoose'

export default (id: string, fotos: string[]): Promise<void> => {
	return new Promise(async (resolve, reject) => {
		const auditorio = await Auditorio.findById(id).catch((err) => {
			new Erro({
				erro: {
					info: 'Não foi possivel ler o auditório do banco de dados',
					err
				}
			}).save()
			return reject('Erro ao baixar auditório')
		})
		if (auditorio) {
			for (const foto of fotos) auditorio.fotos.push(foto)
			auditorio.save().catch((err) => {
				new Erro({
					erro: {
						info: 'Erro ao adicionar fotos ao auditório',
						err
					}
				}).save()
				return reject('Erro ao adicionar fotos ao auditório')
			})
			return resolve()
		}
		return reject('Erro ao baixar auditório')
	})
}
