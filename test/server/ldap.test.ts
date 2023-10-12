import {it, expect} from 'vitest'
import idscbpf from '../../server/utils/idscbpf'
import validIDCBPF from '../../server/utils/validIDCBPF'
import fotoUser from '../../server/utils/fotoUser'
import senhasUser from '../../server/utils/senhasUser'
import limparMembros from '../../server/utils/limparMembros'
import levelUsuario from '../../server/utils/levelUsuario'
import membrosCoordenacao from '../../server/utils/membrosCoordenacao'
import membrosGrupos from '../../server/utils/membrosGrupos'
import fetchInternos from '../../server/utils/fetchInternos'
const {LDAP_PEOPLE_DN} = useRuntimeConfig().public

it('Deveria ser um array de strings válido', async () => {
	const usuarios = await idscbpf()
	expect(Array.isArray(usuarios)).toBe(true)
	for (const usuario of usuarios) expect(usuario).toBeTypeOf('string')
})

it('Deveria ser um um booleano válido', async () => {
	const isValid = await validIDCBPF('tiago')
	expect(isValid).toBe(true)
	const isValid2 = await validIDCBPF('___teste___')
	expect(isValid2).toBe(false)
})

it('Deveria ser uma string válida', async () => {
	const fotoValida = await fotoUser('gabrielrosa')
	expect(fotoValida).toBeTruthy()
	expect(fotoValida).toBeTypeOf('string')
})

it('Deveria ser um array de strings válido', async () => {
	const senhas = await senhasUser('gabrielrosa')
	expect(Array.isArray(senhas)).toBe(true)
	for (const senha of senhas) expect(senha).toBeTypeOf('string')
})

it('Deveria ser um array de strings válido', async () => {
	const senhas = await senhasUser('gabrielrosa')
	expect(Array.isArray(senhas)).toBe(true)
	for (const senha of senhas) expect(senha).toBeTypeOf('string')
})

it('Deveria retornar um array de strings limpo', () => {
	const stringsLimpas = limparMembros([
		`uid=gabrielrosa,${LDAP_PEOPLE_DN.replace(/\s+/g, '')}`,
		'',
		`uid=gustavo,${LDAP_PEOPLE_DN.replace(/\s+/g, '')}`
	])
	expect(stringsLimpas[0]).toBe('gabrielrosa')
	expect(stringsLimpas[1]).toBe('gustavo')
})

it('Deveria ser uma string válido', async () => {
	const level = await levelUsuario('gabrielrosa')
	expect(level).toBe('Administrador')
	const level2 = await levelUsuario('___teste___')
	expect(level2).toBe('')
})

it('Deveria ser um array de strings válido', async () => {
	const membros = await membrosCoordenacao('COTEC')
	expect(Array.isArray(membros)).toBe(true)
	for (const membro of membros) expect(membro).toBeTypeOf('string')
})

it('Deveria ser um array de strings válido', async () => {
	const membros = await membrosGrupos('tecnico', 'auditorios')
	expect(Array.isArray(membros)).toBe(true)
	for (const membro of membros) expect(membro).toBeTypeOf('string')
})

it('Deveria ser um array de strings válido', async () => {
	const membros = await membrosGrupos('tecnico', 'auditorios')
	expect(Array.isArray(membros)).toBe(true)
	for (const membro of membros) expect(membro).toBeTypeOf('string')
})

it('Deveria ser um array de usuários válido', async () => {
	const internos = await fetchInternos()
	expect(internos).toBeDefined()
	expect(Array.isArray(internos)).toBe(true)
})
