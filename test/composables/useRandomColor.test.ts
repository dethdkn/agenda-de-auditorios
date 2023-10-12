import {it, expect} from 'vitest'

it('Deveria retornar uma string', () => {
	const corRetornada = useRandomColor()
	expect(corRetornada).toBeTypeOf('string')
})

it('Deveria retornar uma cor válida', () => {
	const corRetornada = useRandomColor()
	const coresValidas = ['red', 'orange', 'green', 'blue', 'purple', 'pink']
	expect(coresValidas).toContain(corRetornada)
})
