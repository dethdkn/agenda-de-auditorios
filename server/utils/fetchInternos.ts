export default (): Promise<UsuarioInterno[]> => {
	return new Promise(async (resolve, reject) => {
		const internos: UsuarioInterno[] = []
		const adms = await membrosGrupos('administrador', 'auditorios').catch((err) => {
			return reject(err)
		})
		const gerentes = await membrosGrupos('gerente', 'auditorios').catch((err) => {
			return reject(err)
		})
		const secretarias = await membrosGrupos('secretaria', 'auditorios').catch((err) => {
			return reject(err)
		})
		const tecnicos = await membrosGrupos('tecnico', 'auditorios').catch((err) => {
			return reject(err)
		})
		if (adms) {
			for (const adm of adms) {
				internos.push({
					idcbpf: adm,
					nivel: 'Administrador',
					coordenacao: [],
				})
			}
		}
		if (gerentes) {
			for (const gerente of gerentes) {
				internos.push({
					idcbpf: gerente,
					nivel: 'Gerente',
					coordenacao: [],
				})
			}
		}
		if (secretarias) {
			for (const secretaria of secretarias) {
				internos.push({
					idcbpf: secretaria,
					nivel: 'Secretária',
					coordenacao: [],
				})
			}
		}
		if (tecnicos) {
			for (const tecnico of tecnicos) {
				internos.push({
					idcbpf: tecnico,
					nivel: 'Técnico',
					coordenacao: [],
				})
			}
		}
		for (const interno of internos) {
			for (const coordenacao of coordenacoes) {
				if ((await membrosCoordenacao(coordenacao)).includes(interno.idcbpf))
					interno.coordenacao.push(coordenacao)
			}
		}
		return resolve(internos)
	})
}
