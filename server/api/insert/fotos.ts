export default defineEventHandler(async (event) => {
	try {
		const {user} = event.context
		if (['Administrador'].includes(user.level)) {
			const {fields, files} = await FormidablePromise(event.node.req)
			const id = Array.isArray(fields.id) ? fields.id[0] : fields.id
			const fotos: string[] = []
			const arquivos = files.foto
			if (Array.isArray(arquivos)) for (const foto of arquivos) fotos.push(await salvarImagem(foto))
			if (id) {
				await inserirFoto(id, fotos)
				new Log({
					usuario: user.idcbpf,
					acao: `Adicionou fotos ao auditorio ${id}`
				}).save()
				return ''
			}
			throw 'Erro ao adicionar fotos'
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
