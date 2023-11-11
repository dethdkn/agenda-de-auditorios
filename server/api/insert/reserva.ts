export default defineEventHandler(async (event) => {
	try {
		const { user } = event.context
		const {
			urlAuditorio,
			nomeEvento,
			tipoEvento,
			instResponsavel,
			nomeResponsavel,
			emailResponsavel,
			telefoneResponsavel,
			datasHoras,
			recursosSolicitados,
			descricao,
			observacao,
		} = await readBody(event) as {
			urlAuditorio: string
			nomeEvento: string
			tipoEvento: string
			instResponsavel: string
			nomeResponsavel: string
			emailResponsavel: string
			telefoneResponsavel: string
			datasHoras: { data: string; inicio: string; fim: string }[]
			recursosSolicitados: string[]
			descricao: string
			observacao: string
		}
		const auditorio = await fetchAuditorio(urlAuditorio)
		if (auditorio) {
			const datas: { data: Date; inicio: string; fim: string }[] = []
			for (const data of datasHoras) {
				const jsData = new Date(data.data)
				datas.push({
					data: jsData,
					inicio: data.inicio,
					fim: data.fim,
				})
			}
			if (await validarDataReserva(datas, auditorio.nome)) {
				if (['Administrador'].includes(user.level)) {
					const id = await criarReserva(
						auditorio.nome,
						auditorio.coordenacao,
						nomeEvento,
						tipoEvento,
						instResponsavel,
						nomeResponsavel,
						emailResponsavel,
						telefoneResponsavel,
						datas,
						recursosSolicitados,
						user.idcbpf,
						'Aprovado',
						descricao,
						observacao,
						user.idcbpf,
					)
					await enviarEmail(
						'Aprovado',
						user.idcbpf,
						user.coord,
						auditorio.nome,
						auditorio.coordenacao,
						nomeEvento,
						tipoEvento,
						instResponsavel,
						nomeResponsavel,
						emailResponsavel,
						telefoneResponsavel,
						datas,
						recursosSolicitados,
						descricao,
						observacao,
					)
					new Log({
						usuario: user.idcbpf,
						acao: `Criou e Aprovou a reserva ${id}`,
					}).save()
					return 'Reserva criada com sucesso!'
				}
				else if (['Gerente'].includes(user.level)) {
					if (user.coord.includes(auditorio.coordenacao)) {
						const id = await criarReserva(
							auditorio.nome,
							auditorio.coordenacao,
							nomeEvento,
							tipoEvento,
							instResponsavel,
							nomeResponsavel,
							emailResponsavel,
							telefoneResponsavel,
							datas,
							recursosSolicitados,
							user.idcbpf,
							'Aprovado',
							descricao,
							observacao,
							user.idcbpf,
						)
						await enviarEmail(
							'Aprovado',
							user.idcbpf,
							user.coord,
							auditorio.nome,
							auditorio.coordenacao,
							nomeEvento,
							tipoEvento,
							instResponsavel,
							nomeResponsavel,
							emailResponsavel,
							telefoneResponsavel,
							datas,
							recursosSolicitados,
							descricao,
							observacao,
						)
						new Log({
							usuario: user.idcbpf,
							acao: `Criou e Aprovou a reserva ${id}`,
						}).save()
						return 'Reserva criada com sucesso!'
					}
					const id = await criarReserva(
						auditorio.nome,
						auditorio.coordenacao,
						nomeEvento,
						tipoEvento,
						instResponsavel,
						nomeResponsavel,
						emailResponsavel,
						telefoneResponsavel,
						datas,
						recursosSolicitados,
						user.idcbpf,
						'Aguardando',
						descricao,
						observacao,
						user.idcbpf,
					)
					await enviarEmail(
						'Aguardando',
						user.idcbpf,
						user.coord,
						auditorio.nome,
						auditorio.coordenacao,
						nomeEvento,
						tipoEvento,
						instResponsavel,
						nomeResponsavel,
						emailResponsavel,
						telefoneResponsavel,
						datas,
						recursosSolicitados,
						descricao,
						observacao,
					)
					new Log({
						usuario: user.idcbpf,
						acao: `Solicitou a reserva ${id}`,
					}).save()
					return 'Solicitação de reserva criada com sucesso! aguarde a aprovação por um responsável por esse auditório'
				}
				else if (['Secretária', 'Externo'].includes(user.level)) {
					const id = await criarReserva(
						auditorio.nome,
						auditorio.coordenacao,
						nomeEvento,
						tipoEvento,
						instResponsavel,
						nomeResponsavel,
						emailResponsavel,
						telefoneResponsavel,
						datas,
						recursosSolicitados,
						user.idcbpf,
						'Aguardando',
						descricao,
						observacao,
						user.idcbpf,
					)
					await enviarEmail(
						'Aguardando',
						user.idcbpf,
						user.coord,
						auditorio.nome,
						auditorio.coordenacao,
						nomeEvento,
						tipoEvento,
						instResponsavel,
						nomeResponsavel,
						emailResponsavel,
						telefoneResponsavel,
						datas,
						recursosSolicitados,
						descricao,
						observacao,
					)
					new Log({
						usuario: user.idcbpf,
						acao: `Solicitou a reserva ${id}`,
					}).save()
					return 'Solicitação de reserva criada com sucesso! aguarde a aprovação por um responsável por esse auditório'
				}
				throw {
					statusCode: 403,
					statusMessage: 'Proibido',
					message: 'Não autorizado',
				}
			}
			throw {
				statusCode: 500,
				message: 'Erro ao baixar reservas',
				statusMessage: 'Erro no servidor',
			}
		}
		throw {
			statusCode: 500,
			message: 'Erro ao baixar auditório',
			statusMessage: 'Erro no servidor',
		}
	}
	catch (e) {
		if (e && typeof e === 'string')
			throw createError({ statusCode: 500, message: e, statusMessage: 'Erro no servidor' })
		if (e && typeof e === 'object' && 'statusCode' in e && 'message' in e && 'statusMessage' in e) {
			if (
				typeof e.statusCode === 'number'
				&& typeof e.message === 'string'
				&& typeof e.statusMessage === 'string'
			) {
				throw createError({
					statusCode: e.statusCode,
					message: e.message,
					statusMessage: e.statusMessage,
				})
			}
		}
		throw createError({
			statusCode: 500,
			message: 'Ocorreu um erro desconhecido',
			statusMessage: 'Erro no servidor',
		})
	}
})
