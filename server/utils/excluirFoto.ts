export default (id: string, index: string): Promise<void> => {
	return new Promise(async (resolve, reject) => {
		const auditorio = await Auditorio.findById(id).catch((err) => {
			new Erro({
				erro: {
					info: 'Não foi possivel ler o auditório do banco de dados /api/delete/foto.ts',
					err,
				},
			}).save()
			return reject('Erro ao baixar auditório')
		})
		if (auditorio) {
			auditorio.fotos.splice(Number(index), 1)
			auditorio.save().catch((err) => {
				new Erro({
					erro: {
						info: 'Não foi possivel salvar o auditório após excluir a foto do auditorio',
						err,
					},
				}).save()
				return reject('Erro ao excluir foto')
			})
			return resolve()
		}
		return reject('Erro ao baixar auditório - ID Inválida')
	})
}
