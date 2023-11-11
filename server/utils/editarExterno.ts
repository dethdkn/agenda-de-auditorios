import { sha512Crypt } from 'ldap-sha512'

export default (id: string, instituicao: string, senha: string): Promise<void> => {
	return new Promise(async (resolve, reject) => {
		const externo = await Externo.findById(id).catch((err) => {
			new Erro({
				erro: {
					info: 'Não foi possivel ler os usuários externos',
					err,
				},
			}).save()
			return reject('Erro ao baixar usuários externos')
		})
		if (externo) {
			if (instituicao)
				externo.instituicao = instituicao
			if (senha)
				externo.senha = await sha512Crypt(senha)
			externo.save().catch((err) => {
				new Erro({
					erro: {
						info: 'Não foi possivel editar o usuário externo',
						err,
					},
				}).save()
				return reject('Erro ao editar usuário externo')
			})
			return resolve()
		}
		return reject('Erro ao baixar usuários externos - ID Inválida')
	})
}
