export default defineEventHandler(async (event) => {
	try {
		const { user } = event.context
		const { email, instituicao, senha } = await readBody(event) as {
			email: string
			instituicao: string
			senha: string
		}
		if (['Administrador'].includes(user.level)) {
			await criarExterno(email, instituicao, senha)
			new Log({
				usuario: user.idcbpf,
				acao: `Criou o usuário externo ${email}`,
			}).save()
			return 'Ok'
		}
		throw {
			statusCode: 403,
			statusMessage: 'Proibido',
			message: 'Nao autorizado',
		}
	}
	catch (e) {
		if (e && typeof e === 'string')
			throw createError({ statusCode: 500, message: e, statusMessage: 'Erro no servidor' })
		if (e && typeof e === 'object' && 'statusCode' in e && 'message' in e && 'statusMessage' in e) {
			if (
				typeof e.statusCode === 'number'
				&& typeof e.message === 'string'
				&& typeof e.statusMessage === 'string'
			) {
				throw createError({
					statusCode: e.statusCode,
					message: e.message,
					statusMessage: e.statusMessage,
				})
			}
		}
		throw createError({
			statusCode: 500,
			message: 'Ocorreu um erro desconhecido',
			statusMessage: 'Erro no servidor',
		})
	}
})
