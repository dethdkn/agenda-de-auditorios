import {it, expect} from 'vitest'

it('Deveria retornar um booleano', () => {
	const email = 'test@cbpf.br'
	const retorno = useValidateEmail(email)
	expect(retorno).toBeTypeOf('boolean')
})

it('Deveria retornar verdadeiro', () => {
	const email = 'teste@gmail.com'
	const retorno = useValidateEmail(email)
	expect(retorno).toBe(true)
})

it('Deveria retornar falso', () => {
	const email = 'abc'
	const retorno = useValidateEmail(email)
	expect(retorno).toBe(false)
})
