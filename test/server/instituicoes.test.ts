import {it, expect} from 'vitest'
import fetchInstituicoes from '../../server/utils/fetchInstituicoes'

it('Deveria ler todos as instituições sem erros', async () => {
	const instituicoes = await fetchInstituicoes()
	expect(instituicoes).toBeDefined()
})
