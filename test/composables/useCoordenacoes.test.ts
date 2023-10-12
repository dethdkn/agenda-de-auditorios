import {it, expect} from 'vitest'

it('Deveria ser um array válido', () => {
	expect(Array.isArray(useCoordenacoes)).toBe(true)
	for (const coordenacao of useCoordenacoes) expect(coordenacao).toBeTypeOf('string')
})
