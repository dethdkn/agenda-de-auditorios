export default (): Promise<Email[]> => {
	return new Promise(async (resolve, reject) => {
		const emails = await Email.find()
			.sort({ nome: 1 })
			.catch((err) => {
				new Erro({
					erro: {
						info: 'Não foi possivel ler os emails do banco de dados',
						err,
					},
				}).save()
				return reject('Erro ao baixar emails')
			})
		if (emails)
			return resolve(emails)
		return reject('Erro ao baixar emails')
	})
}
