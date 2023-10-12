import {Auditorio, Erro} from './mongoose'
import fetchAuditorio from './fetchAuditorio'

export default (
	nome: string,
	capacidade: string,
	coordenacao: string,
	url: string,
	itens: string[],
	descricao?: string,
	planta?: string | undefined | void
): Promise<string> => {
	return new Promise(async (resolve, reject) => {
		const audExistente = await fetchAuditorio(url).catch((err) => {
			return reject(err)
		})
		if (!audExistente) {
			const aud = await new Auditorio({
				nome,
				capacidade,
				coordenacao,
				url,
				descricao,
				itens,
				planta
			})
				.save()
				.catch((err) => {
					new Erro({
						erro: {
							info: 'Erro ao criar auditorio no banco de dados',
							err
						}
					}).save()
					return reject('Erro ao criar auditório')
				})
			if (aud) return resolve(aud._id)
			return reject('Erro ao criar auditório')
		}
		return reject('Erro ao criar auditório - URL já existe')
	})
}
