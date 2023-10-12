import {it, expect} from 'vitest'

it('Deveria ser um booleando', () => {
	const retorno = useIsPassado(new Date())
	expect(retorno).toBeTypeOf('boolean')
})

it('Deveria ser verdadeiro', () => {
	const retorno = useIsPassado(new Date(1970, 0, 1))
	expect(retorno).toBe(true)
})

it('Deveria ser falso', () => {
	const retorno = useIsPassado(new Date(3000, 0, 1))
	expect(retorno).toBe(false)
})
