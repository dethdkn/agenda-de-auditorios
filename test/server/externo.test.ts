import {it, expect} from 'vitest'
import criarExterno from '../../server/utils/criarExterno'
import editarExterno from '../../server/utils/editarExterno'
import fetchExterno from '../../server/utils/fetchExterno'
import excluirExterno from '../../server/utils/excluirExterno'
import fetchExternos from '../../server/utils/fetchExternos'

let externoID = ''

it('Deveria criar o usuário externo sem erros', async () => {
	let ocorreuErro = false
	try {
		externoID = await criarExterno('tiago@gmail.com', 'abc', 'senhaaaa')
	} catch (e) {
		ocorreuErro = true
	}
	if (ocorreuErro) throw new Error('Promessa de criar usuário externo retornou erro')
})

it('Deveria editar o usuário externo sem erros', async () => {
	let ocorreuErro = false
	try {
		await editarExterno(externoID, 'cba', 'aaaahnes')
	} catch (e) {
		ocorreuErro = true
	}
	if (ocorreuErro) throw new Error('Promessa de editar usuário externo retornou erro')
})

it('Deveria ler o usuário externo sem erros', async () => {
	const externo = await fetchExterno(externoID)
	expect(externo).toBeDefined()
	if (externo) {
		expect(externo._id).toEqual(externoID)
		expect(externo.email).toBe('tiago@gmail.com')
		expect(externo.instituicao).toBe('cba')
		expect(externo.senha).toBeDefined()
	}
})

it('Deveria excluir o usuário externo sem erros', async () => {
	let ocorreuErro = false
	try {
		await excluirExterno(externoID)
	} catch (e) {
		ocorreuErro = true
	}
	if (ocorreuErro) throw new Error('Promessa de excluir usuário externo retornou erro')
})

it('Deveria ler todos os usuários externos sem erros', async () => {
	const externos = await fetchExternos()
	expect(externos).toBeDefined()
})
