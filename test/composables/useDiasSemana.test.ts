import {it, expect} from 'vitest'

it('Deveria ser um array válido', () => {
	expect(Array.isArray(useDiasSemana)).toBe(true)
	for (const dias of useDiasSemana) expect(dias).toBeTypeOf('string')
})
