import {it, expect} from 'vitest'

it('Deveria retornar um booleano', () => {
	const senha = 'S3nh@MTd1f1c1l'
	const retorno = useValidatePasswd(senha)
	expect(retorno).toBeTypeOf('boolean')
})

it('Deveria retornar verdadeiro', () => {
	const senha = 'S3nh@MTd1f1c1l'
	const retorno = useValidatePasswd(senha)
	expect(retorno).toBe(true)
})

it('Deveria retornar falso', () => {
	const senha = 'senhaFacil'
	const retorno = useValidatePasswd(senha)
	expect(retorno).toBe(false)
})
