export default (email: string, auditorios: string[]): Promise<void> => {
	return new Promise(async (resolve, reject) => {
		const mail = await Email.findOne({ email }).catch((err) => {
			new Erro({
				erro: {
					info: 'Não foi possivel ler o email do banco de dados',
					err,
				},
			}).save()
			return reject('Erro ao baixar email do banco de dados')
		})
		if (mail) {
			mail.auditorios = auditorios
			mail.save().catch((err) => {
				new Erro({
					erro: {
						info: 'Não foi possivel editar o email do banco de dados',
						err,
					},
				}).save()
				return reject('Erro ao editar email do banco de dados')
			})
			return resolve()
		}
		return reject('Erro ao baixar email do banco de dados - email Inválido')
	})
}
