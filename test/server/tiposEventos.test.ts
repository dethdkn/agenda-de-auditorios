import {it, expect} from 'vitest'
import fetchTiposEventos from '../../server/utils/fetchTiposEventos'

it('Deveria ler todos as instituições sem erros', async () => {
	const tiposEventos = await fetchTiposEventos()
	expect(tiposEventos).toBeDefined()
})
