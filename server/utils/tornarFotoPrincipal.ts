export default (id: string, index: string): Promise<void> => {
	return new Promise(async (resolve, reject) => {
		const auditorio = await Auditorio.findById(id).catch((err) => {
			new Erro({
				erro: {
					info: 'Não foi possivel ler o auditório do banco de dados',
					err,
				},
			}).save()
			return reject('Erro ao baixar auditório')
		})
		if (auditorio) {
			const principal = auditorio.fotos.splice(Number(index), 1)[0]
			auditorio.fotos.unshift(principal)
			auditorio.save().catch((err) => {
				new Erro({
					erro: {
						info: 'Não foi possivel tornar esta foto principal do auditorio',
						err,
					},
				}).save()
				return reject('Erro ao tornar foto principal')
			})
			return resolve()
		}
		return reject('Erro ao baixar auditório')
	})
}
