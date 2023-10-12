export default defineEventHandler(async (event) => {
	const {coord, aud, uid} = getQuery(event) as {coord?: string; aud?: string; uid?: string}
	try {
		if (coord) return await gerarICS(await fetchReservasAprovadasPorCoord(coord))
		if (aud) return await gerarICS(await fetchReservasAprovadasPorAuditorio(aud))
		if (uid) return await gerarICS(await fetchReservasAprovadasPorSolicitante(uid))
		return await gerarICS(await fetchReservasAprovadas())
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
