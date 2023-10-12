import {it, expect} from 'vitest'
import signToken from '../../server/utils/signToken'
import decodeToken from '../../server/utils/decodeToken'

it('Deveria criar o usuário externo sem erros', async () => {
	const usuarioExemplo: TokenUsuario = {
		authenticated: true,
		idcbpf: 'tiago',
		level: 'Técnico',
		coord: ['COTEC', 'DIR']
	}
	const token = signToken(usuarioExemplo)
	expect(token).toBeDefined()
	expect(token).toBeTypeOf('string')

	const decodificado = await decodeToken(token)
	expect(decodificado).toBeDefined()
	if (decodificado) {
		expect(decodificado.authenticated).toBe(true)
		expect(decodificado.idcbpf).toBe('tiago')
		expect(decodificado.level).toBe('Técnico')
		expect(decodificado.coord).toEqual(['COTEC', 'DIR'])
	}
})
