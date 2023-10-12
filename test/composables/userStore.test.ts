import {it, expect} from 'vitest'

it('Deveria ser uma string', () => {
	expect(userStore().token).toBeTypeOf('string')
})

it('Deveria ser um booleano', () => {
	expect(userStore().isLoggedIn).toBeTypeOf('boolean')
})

it('Deveria ser uma string', () => {
	expect(userStore().idcbpf).toBeTypeOf('string')
})

it('Deveria ser uma string', () => {
	expect(userStore().level).toBeTypeOf('string')
})

it('Deveria ser um array', () => {
	expect(Array.isArray(userStore().coord)).toBe(true)
})

it('Deveria atribuir os valores', () => {
	userStore().setUserState('abc', true, 'tiago', 'Gerente', ['coord1', 'coord2', 'coord3'])
	expect(userStore().token).toBe('abc')
	expect(userStore().isLoggedIn).toBe(true)
	expect(userStore().idcbpf).toBe('tiago')
	expect(userStore().level).toBe('Gerente')
	expect(userStore().coord).toEqual(['coord1', 'coord2', 'coord3'])
})

it('Deveria limpar os valores', () => {
	userStore().clearUserState()
	expect(userStore().token).toBe('')
	expect(userStore().isLoggedIn).toBe(false)
	expect(userStore().idcbpf).toBe('')
	expect(userStore().level).toBe('')
	expect(userStore().coord).toEqual([])
})
