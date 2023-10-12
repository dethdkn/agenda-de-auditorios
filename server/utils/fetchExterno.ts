import {Externo, Erro} from './mongoose'

export default (email: string): Promise<UsuarioExterno | null> => {
	return new Promise(async (resolve, reject) => {
		const externo = await Externo.findOne({email}).catch((err) => {
			new Erro({
				erro: {
					info: 'Não foi possivel ler o usuário externo',
					err
				}
			}).save()
			return reject('Erro ao baixar usuário externo')
		})
		if (externo) return resolve(externo)
		return resolve(null)
	})
}
