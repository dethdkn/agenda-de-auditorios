import { readFile } from 'node:fs/promises'

const { IMAGES_PATH } = useRuntimeConfig()

export default defineEventHandler(async (event) => {
	try {
		const { f } = getQuery(event) as { f: string }
		if (/^([^./]+)\.webp$/.test(f)) {
			setResponseHeaders(event, {
				'Content-Type': 'image/webp',
			})
			return await readFile(`${IMAGES_PATH}${f}`)
		}
		throw {
			statusCode: 403,
			statusMessage: 'Proibido',
			message: 'Você não tem permissão para acessar esse arquivo',
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
			statusCode: 403,
			message: 'Você não tem permissão para acessar esse arquivo',
			statusMessage: 'Proibido',
		})
	}
})
