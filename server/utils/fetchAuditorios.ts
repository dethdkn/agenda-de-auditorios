export default (): Promise<Auditorio[]> => {
	return new Promise(async (resolve, reject) => {
		const auditorios = await Auditorio.find()
			.sort({ nome: 1 })
			.catch((err) => {
				new Erro({
					erro: {
						info: 'Não foi possivel ler os auditórios do banco de dados',
						err,
					},
				}).save()
				return reject('Erro ao baixar auditórios')
			})
		if (auditorios)
			return resolve(auditorios)
		return reject('Erro ao baixar auditórios')
	})
}
