import {it, expect} from 'vitest'

it('Deveria ser um array válido', () => {
	expect(Array.isArray(useHorasInicio)).toBe(true)
	for (const horaInicio of useHorasInicio) expect(horaInicio).toBeTypeOf('string')
})
