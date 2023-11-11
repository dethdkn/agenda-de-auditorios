export default defineEventHandler(async (event) => {
	try {
		const { user } = event.context
		const { auditorio, coordenacao, status, data } = (await readBody(event)) as {
			auditorio: string
			coordenacao: string
			status: string
			data: string
		}
		const filtro: any = {}
		if (auditorio && auditorio !== 'Selecione')
			filtro.audNome = auditorio
		if (coordenacao && coordenacao !== 'Selecione')
			filtro.audCoord = coordenacao
		if (status && status !== 'Selecione')
			filtro.status = status
		if (data && data !== '')
			filtro['datas.data'] = new Date(data)
		if (['Administrador', 'Gerente', 'Secretária', 'Técnico', 'Externo'].includes(user.level)) {
			if (['Secretária', 'Externo'].includes(user.level))
				filtro.solicitadoPor = user.idcbpf
			if (['Gerente'].includes(user.level))
				filtro.$or = [{ audCoord: { $in: user.coord } }, { solicitadoPor: user.idcbpf }]

			return await fetchReservas(filtro)
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
