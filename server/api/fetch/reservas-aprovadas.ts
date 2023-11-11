export default defineEventHandler(async (event) => {
	const { coord, auditorio, uid } = (await readBody(event)) as {
		coord: string
		auditorio: string
		uid: string
	}
	try {
		if (coord && coord !== 'Selecione')
			return await fetchReservasAprovadasPorCoord(coord)
		if (auditorio && auditorio !== 'Selecione')
			return await fetchReservasAprovadasPorAuditorio(auditorio)
		if (uid && uid !== '')
			return await fetchReservasAprovadasPorSolicitante(uid)
		return await fetchReservasAprovadas()
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
