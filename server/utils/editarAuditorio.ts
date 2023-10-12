import {Auditorio, Erro} from './mongoose'

export default (
	id: string,
	nome: string,
	capacidade: string,
	coordenacao: string,
	url: string,
	itens: string[],
	descricao?: string,
	planta?: string | void
): Promise<void> => {
	return new Promise(async (resolve, reject) => {
		const auditorio = await Auditorio.findById(id).catch((err) => {
			new Erro({
				erro: {
					info: 'Não foi possivel ler o auditório do banco de dados',
					err
				}
			}).save()
			return reject('Erro ao baixar auditório')
		})
		if (auditorio) {
			if (nome !== auditorio.nome) auditorio.nome = nome
			if (capacidade !== auditorio.capacidade) auditorio.capacidade = capacidade
			if (coordenacao !== auditorio.coordenacao) auditorio.coordenacao = coordenacao
			if (url !== auditorio.url) auditorio.url = url
			if (descricao && descricao !== auditorio.descricao) auditorio.descricao = descricao
			if (itens !== auditorio.itens) auditorio.itens = itens
			if (planta) auditorio.planta = planta
			auditorio.save().catch((err) => {
				new Erro({
					erro: {
						info: 'Não foi possivel editar o auditorio',
						err
					}
				}).save()
				return reject('Erro ao editar auditório')
			})
			return resolve()
		}
		return reject('Erro ao baixar auditório - ID inválida')
	})
}
