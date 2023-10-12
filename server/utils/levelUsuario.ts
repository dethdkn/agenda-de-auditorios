import membrosGrupos from './membrosGrupos'

export default (
	idcbpf: string
): Promise<'' | 'Administrador' | 'Gerente' | 'Secretária' | 'Técnico' | 'Externo'> => {
	return new Promise(async (resolve, reject) => {
		let level: '' | 'Administrador' | 'Gerente' | 'Secretária' | 'Técnico' | 'Externo' = ''
		const tecs = await membrosGrupos('tecnico', 'auditorios').catch((err) => {
			return reject(err)
		})
		const secs = await membrosGrupos('secretaria', 'auditorios').catch((err) => {
			return reject(err)
		})
		const gers = await membrosGrupos('gerente', 'auditorios').catch((err) => {
			return reject(err)
		})
		const adms = await membrosGrupos('administrador', 'auditorios').catch((err) => {
			return reject(err)
		})
		if (tecs) if (tecs.includes(idcbpf)) level = 'Técnico'
		if (secs) if (secs.includes(idcbpf)) level = 'Secretária'
		if (gers) if (gers.includes(idcbpf)) level = 'Gerente'
		if (adms) if (adms.includes(idcbpf)) level = level = 'Administrador'
		return resolve(level)
	})
}
