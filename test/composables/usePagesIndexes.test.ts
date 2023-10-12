import {it, expect} from 'vitest'

it('Deveria ser um array válido', () => {
	expect(Array.isArray(usePagesIndexes)).toBe(true)
	for (const page of usePagesIndexes) expect(page).toBeTypeOf('string')
})
