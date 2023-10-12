import {it, expect} from 'vitest'
import validarSenhas from '../../server/utils/validarSenhas'

it('Deveria criar o usuário externo sem erros', async () => {
	const resultadoSSha = await validarSenhas('senhadeteste', [
		'{SSHA}m12/yEJ04cPnRteLwsg+/wqK8k9hNW9nWWZmUjVKemU='
	])
	expect(resultadoSSha).toBe(true)

	const resultadoCRYPT = await validarSenhas('senhadeteste', [
		'{CRYPT}$6$.Jt4/GkB$HhpohngBhybKCnkTe6L7vgC.6JN1DbLEDBdXoX8chOR.HWL.bvFlMjKd812KcGAvFxOAVTcsWDWhXstmOHo6o0'
	])
	expect(resultadoCRYPT).toBe(true)
})
