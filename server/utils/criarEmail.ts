export default (email: string, auditorios: string[]): Promise<string> => {
	return new Promise(async (resolve, reject) => {
		const mail = await fetchEmail(email).catch((err) => {
			return reject(err)
		})
		if (!mail) {
			const ext = await new Email({ email, auditorios })
				.save()
				.catch((err) => {
					new Erro({
						erro: {
							info: 'Erro ao criar email no banco de dados',
							err,
						},
					}).save()
					return reject('Erro ao criar email no banco de dados')
				})
			if (ext)
				return resolve(ext._id)
			return reject('Erro ao criar email no banco de dados')
		}
		return reject('E-mail já cadastrado')
	})
}
