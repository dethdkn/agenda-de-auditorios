export default (audNome: string, auditorios: Auditorio[]): number => {
	for (const auditorio of auditorios)
		if (auditorio.nome === audNome) return auditorios.indexOf(auditorio)
	return 15
}
