import {Externo, Erro} from './mongoose'

export default (): Promise<UsuarioExterno[]> => {
	return new Promise(async (resolve, reject) => {
		const externos = await Externo.find({}, {senha: 0})
			.sort({email: 1})
			.catch((err) => {
				new Erro({
					erro: {
						info: 'Não foi possivel ler os usuarios externos',
						err
					}
				}).save()
				return reject('Erro ao baixar usuários externos')
			})
		if (externos) return resolve(externos)
		return reject('Erro ao baixar usuários externos')
	})
}
