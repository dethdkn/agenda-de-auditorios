export default (id: string): Promise<void> => {
	return new Promise(async (resolve, reject) => {
		await Externo.findByIdAndDelete(id).catch((err) => {
			new Erro({
				erro: {
					info: 'Erro ao excluir usuário externo do banco de dados',
					err,
				},
			}).save()
			return reject('Erro ao excluir usuário externo')
		})
		return resolve()
	})
}
