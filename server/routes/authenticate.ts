export default defineEventHandler(async (event) => {
	try {
		const {idcbpf, passwd} = (await readBody(event)) as {
			idcbpf: string
			passwd: string
		}
		const usuarioAutenticado: TokenUsuario = {
			authenticated: false,
			idcbpf: '',
			level: '',
			coord: []
		}
		if (isEmail(idcbpf)) {
			const externo = await fetchExterno(idcbpf)
			if (externo && externo.senha && (await validarSenhas(passwd, [externo.senha]))) {
				usuarioAutenticado.authenticated = true
				usuarioAutenticado.level = 'Externo'
				usuarioAutenticado.idcbpf = idcbpf
				const token = signToken(usuarioAutenticado)
				return {
					token,
					isLoggedIn: true,
					idcbpf: idcbpf,
					level: usuarioAutenticado.level,
					coord: usuarioAutenticado.coord
				}
			}
			throw {
				statusCode: 401,
				statusMessage: 'Nao autorizado',
				message: 'Usuario e/ou Senha inválidos'
			}
		}
		if ((await validIDCBPF(idcbpf)) && passwd) {
			usuarioAutenticado.level = await levelUsuario(idcbpf)
			if (usuarioAutenticado.level && (await validarSenhas(passwd, await senhasUser(idcbpf)))) {
				for (const coordenacao of coordenacoes)
					if ((await membrosCoordenacao(coordenacao)).includes(idcbpf))
						usuarioAutenticado.coord.push(coordenacao)
				usuarioAutenticado.authenticated = true
				usuarioAutenticado.idcbpf = idcbpf
				const token = signToken(usuarioAutenticado)
				return {
					token,
					isLoggedIn: true,
					idcbpf: idcbpf,
					level: usuarioAutenticado.level,
					coord: usuarioAutenticado.coord
				}
			}
			throw {
				statusCode: 401,
				statusMessage: 'Nao autorizado',
				message: 'Usuario e/ou Senha inválidos'
			}
		}
		throw {
			statusCode: 401,
			statusMessage: 'Nao autorizado',
			message: 'Usuario e/ou Senha inválidos'
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
