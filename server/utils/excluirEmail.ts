export default (id: string): Promise<void> => {
	return new Promise(async (resolve, reject) => {
		await Email.findByIdAndDelete(id).catch((err) => {
			new Erro({
				erro: {
					info: 'Erro ao excluir email do banco de dados',
					err,
				},
			}).save()
			return reject('Erro ao excluir email')
		})
		return resolve()
	})
}
