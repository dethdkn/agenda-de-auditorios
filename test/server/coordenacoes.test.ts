import {it, expect} from 'vitest'
import coordenacoes from '../../server/utils/coordenacoes'

it('Deveria ser um array válido', () => {
	expect(Array.isArray(coordenacoes)).toBe(true)
	for (const coordenacao of coordenacoes) expect(coordenacao).toBeTypeOf('string')
})
