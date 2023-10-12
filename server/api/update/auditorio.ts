export default defineEventHandler(async (event) => {
	try {
		const {user} = event.context
		if (['Administrador'].includes(user.level)) {
			const {fields, files} = await FormidablePromise(event.node.req)
			const id = Array.isArray(fields.id) ? fields.id[0] : fields.id
			const nome = Array.isArray(fields.nome) ? fields.nome[0] : fields.nome
			const capacidade = Array.isArray(fields.capacidade) ? fields.capacidade[0] : fields.capacidade
			const coordenacao = Array.isArray(fields.coordenacao)
				? fields.coordenacao[0]
				: fields.coordenacao
			const url = Array.isArray(fields.url) ? fields.url[0] : fields.url
			const descricao = Array.isArray(fields.descricao) ? fields.descricao[0] : fields.descricao
			const itens = Array.isArray(fields.itens) ? fields.itens[0] : fields.itens
			const plantaFile = Array.isArray(files.planta) ? files.planta[0] : files.planta
			let planta: string | undefined = undefined
			if (plantaFile) planta = await salvarImagem(plantaFile)
			let itensArr: string[] = []
			if (itens)
				itensArr = itens
					.split(',')
					.map((item) => item.trim())
					.filter((item) => item.trim() !== '')
			if (id && nome && capacidade && coordenacao && url) {
				await editarAuditorio(id, nome, capacidade, coordenacao, url, itensArr, descricao, planta)
				new Log({
					usuario: user.idcbpf,
					acao: `Editou o auditorio ${nome}`
				}).save()
				return ''
			}
			throw 'Erro ao editar auditório'
		}
		throw {
			statusCode: 403,
			statusMessage: 'Proibido',
			message: 'Nao autorizado'
		}
	} catch (e) {
		if (e && typeof e === 'string')
			throw createError({statusCode: 500, message: e, statusMessage: 'Erro no servidor'})
		if (e && typeof e === 'object' && 'statusCode' in e && 'message' in e && 'statusMessage' in e)
			if (
				typeof e.statusCode === 'number' &&
				typeof e.message === 'string' &&
				typeof e.statusMessage === 'string'
			)
				throw createError({
					statusCode: e.statusCode,
					message: e.message,
					statusMessage: e.statusMessage
				})
		throw createError({
			statusCode: 500,
			message: 'Ocorreu um erro desconhecido',
			statusMessage: 'Erro no servidor'
		})
	}
})
