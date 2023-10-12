import {it, expect} from 'vitest'

it('Deveria ser um array válido', () => {
	expect(Array.isArray(useHorasFim)).toBe(true)
	for (const horaFim of useHorasFim) expect(horaFim).toBeTypeOf('string')
})
