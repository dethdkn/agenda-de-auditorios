export default (id: string): Promise<void> => {
	return new Promise(async (resolve, reject) => {
		await Auditorio.findByIdAndDelete(id).catch((err) => {
			new Erro({
				erro: {
					info: 'Erro ao excluir auditorio do banco de dados',
					err,
				},
			}).save()
			return reject('Erro ao excluir auditório')
		})
		return resolve()
	})
}
