export default (email: string): Promise<Email | null> => {
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
		if (mail)
			return resolve(mail)
		return resolve(null)
	})
}
