import {it, expect} from 'vitest'
import criarAuditorio from '../../server/utils/criarAuditorio'
import editarAuditorio from '../../server/utils/editarAuditorio'
import inserirFoto from '../../server/utils/inserirFoto'
import tornarFotoPrincipal from '../../server/utils/tornarFotoPrincipal'
import excluirFoto from '../../server/utils/excluirFoto'
import fetchAuditorio from '../../server/utils/fetchAuditorio'
import excluirAuditorio from '../../server/utils/excluirAuditorio'
import fetchAuditorios from '../../server/utils/fetchAuditorios'

let auditorioID = ''
let auditorioURL = '0___teste___0'

it('Deveria criar o auditório sem erros', async () => {
	let ocorreuErro = false
	try {
		auditorioID = await criarAuditorio(
			'teste',
			'10',
			'COTEC',
			'___teste___',
			['teste', 'test', 'tst'],
			'Descrição teste',
			'planteste'
		)
	} catch (e) {
		ocorreuErro = true
	}
	if (ocorreuErro) throw new Error('Promessa de criar auditório retornou erro')
})

it('Deveria editar o auditório sem erros', async () => {
	let ocorreuErro = false
	try {
		await editarAuditorio(
			auditorioID,
			'_teste',
			'20',
			'_COTEC',
			auditorioURL,
			['_teste', '_test', '_tst'],
			'__Descrição teste__',
			'_planteste'
		)
	} catch (e) {
		ocorreuErro = true
	}
	if (ocorreuErro) throw new Error('Promessa de editar auditório retornou erro')
})

it('Deveria inserir fotos sem erros', async () => {
	let ocorreuErro = false
	try {
		await inserirFoto(auditorioID, ['foto1', 'foto2', 'foto3', 'foto4', 'foto5'])
	} catch (e) {
		ocorreuErro = true
	}
	if (ocorreuErro) throw new Error('Promessa de inserir foto retornou erro')
})

it('Deveria tornar foto principal sem erros', async () => {
	let ocorreuErro = false
	try {
		await tornarFotoPrincipal(auditorioID, '3')
	} catch (e) {
		ocorreuErro = true
	}
	if (ocorreuErro) throw new Error('Promessa de tornar foto principal retornou erro')
})

it('Deveria excluir foto sem erros', async () => {
	let ocorreuErro = false
	try {
		await excluirFoto(auditorioID, '2')
	} catch (e) {
		ocorreuErro = true
	}
	if (ocorreuErro) throw new Error('Promessa de tornar foto principal retornou erro')
})

it('Deveria ler o auditório sem erros', async () => {
	const auditorio = await fetchAuditorio(auditorioURL)
	expect(auditorio).toBeDefined()
	if (auditorio) {
		expect(auditorio._id).toEqual(auditorioID)
		expect(auditorio.nome).toBe('_teste')
		expect(auditorio.capacidade).toBe('20')
		expect(auditorio.url).toBe(auditorioURL)
		expect(auditorio.itens).toEqual(['_teste', '_test', '_tst'])
		expect(auditorio.descricao).toBe('__Descrição teste__')
		expect(auditorio.planta).toBe('_planteste')
		expect(auditorio.fotos).toBeDefined()
	}
})

it('Deveria excluir o auditório sem erros', async () => {
	let ocorreuErro = false
	try {
		await excluirAuditorio(auditorioID)
	} catch (e) {
		ocorreuErro = true
	}
	if (ocorreuErro) throw new Error('Promessa de excluir auditório retornou erro')
})

it('Deveria ler todos os auditórios sem erros', async () => {
	const auditorios = await fetchAuditorios()
	expect(auditorios).toBeDefined()
})
