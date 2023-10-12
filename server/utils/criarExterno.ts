import {sha512Crypt} from 'ldap-sha512'
import {Externo, Erro} from './mongoose'
import fetchExterno from './fetchExterno'

export default (email: string, instituicao: string, senha: string): Promise<string> => {
	return new Promise(async (resolve, reject) => {
		const externo = await fetchExterno(email).catch((err) => {
			return reject(err)
		})
		if (!externo) {
			const ext = await new Externo({email, instituicao, senha: await sha512Crypt(senha)})
				.save()
				.catch((err) => {
					new Erro({
						erro: {
							info: 'Erro ao criar usuário externo',
							err
						}
					}).save()
					return reject('Erro ao criar usuário externo')
				})
			if (ext) return resolve(ext._id)
			return reject('Erro ao criar usuário externo')
		}
		return reject('E-mail já cadastrado')
	})
}
