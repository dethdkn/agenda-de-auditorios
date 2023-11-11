export default (selecionadas: Date[]): boolean => {
	let isPassado = false
	const hoje = new Date()
	for (const dataSelec of selecionadas) {
		hoje.setHours(0, 0, 0, 0)
		dataSelec.setHours(0, 0, 0, 0)
		if (dataSelec < hoje)
			isPassado = true
	}
	return isPassado
}
