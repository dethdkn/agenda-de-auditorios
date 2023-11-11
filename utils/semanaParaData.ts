export default (dataInicio: Date, diaSemana: number, quantidade: number | string): Date[] => {
	const resultado: Date[] = []
	const novaData = new Date(dataInicio)
	while (resultado.length < Number(quantidade)) {
		const diaAtual = novaData.getDay()
		if (diaAtual === diaSemana)
			resultado.push(new Date(novaData))
		novaData.setDate(novaData.getDate() + 1)
	}
	return resultado
}
