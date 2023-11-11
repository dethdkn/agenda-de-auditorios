export default (url: string): Promise<Auditorio | null | void> => {
	return new Promise(async (resolve, reject) => {
		const auditorio = await Auditorio.findOne({ url }).catch((err) => {
			new Erro({
				erro: {
					info: 'Não foi possivel ler o auditório do banco de dados',
					err,
				},
			}).save()
			return reject('Erro ao baixar auditório')
		})
		return resolve(auditorio)
	})
}
