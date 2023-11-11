import excel from 'exceljs'

export default defineEventHandler(async (event) => {
	try {
		const { user } = event.context
		const filtro: any = {}
		if (['Administrador', 'Gerente', 'Secretária', 'Técnico', 'Externo'].includes(user.level)) {
			if (['Secretária', 'Externo'].includes(user.level))
				filtro.solicitadoPor = user.idcbpf
			if (['Gerente'].includes(user.level))
				filtro.$or = [{ audCoord: { $in: user.coord } }, { solicitadoPor: user.idcbpf }]

			const reservas = await fetchReservas(filtro)
			const items: {
				_id?: string
				nomeEvento: string
				tipoEvento: string
				audNome: string
				audCoord: string
				instResponsavel: string
				nomeResponsavel: string
				emailResponsavel: string
				telefoneResponsavel: string
				recursosAud: string
				descricao?: string
				observacao?: string
				solicitadoPor: string
				aceitoPor?: string
				status: string
				datas: string
			}[] = []
			for (const reserva of reservas) {
				const datasString: string[] = []
				const datasHorasString: string[] = []
				for (const data of reserva.datas) {
					datasString.push(new Date(data.data).toLocaleDateString('pt-br'))
					datasHorasString.push(
						`${new Date(data.data).toLocaleDateString('pt-br')} das ${data.inicio} às ${data.fim}`,
					)
				}
				items.push({
					_id: reserva._id,
					nomeEvento: reserva.nomeEvento,
					tipoEvento: reserva.tipoEvento,
					audNome: reserva.audNome,
					audCoord: reserva.audCoord,
					instResponsavel: reserva.instResponsavel,
					nomeResponsavel: reserva.nomeResponsavel,
					emailResponsavel: reserva.emailResponsavel,
					telefoneResponsavel: reserva.telefoneResponsavel,
					recursosAud: reserva.recursosAud.join(', '),
					descricao: reserva.descricao,
					observacao: reserva.observacao,
					solicitadoPor: reserva.solicitadoPor,
					aceitoPor: reserva.aceitoPor,
					status: reserva.status,
					datas: datasString.join(' | '),
				})
			}
			const workbook = new excel.Workbook()
			workbook.creator = 'WEB - CBPF'
			workbook.lastModifiedBy = 'WEB - CBPF'
			workbook.created = new Date()
			workbook.modified = new Date()
			workbook.lastPrinted = new Date()
			const worksheet = workbook.getWorksheet('Reservas')
			if (worksheet) {
				const row = worksheet.getRow(1)
				row.getCell(1).value = 'ID'
				row.getCell(2).value = 'Nome do Evento'
				row.getCell(3).value = 'Tipo do Evento'
				row.getCell(4).value = 'Auditório'
				row.getCell(5).value = 'Coordenação do Auditório'
				row.getCell(6).value = 'Instituição Responsável'
				row.getCell(7).value = 'Nome do Responsável'
				row.getCell(8).value = 'Email do Responsável'
				row.getCell(9).value = 'Telefone do Responsável'
				row.getCell(10).value = 'Recursos do Auditório'
				row.getCell(11).value = 'Descrição'
				row.getCell(12).value = 'Observações'
				row.getCell(13).value = 'Solicitado Por'
				row.getCell(14).value = 'Aceito/Recusado Por'
				row.getCell(15).value = 'Status'
				row.getCell(16).value = 'Datas'
				let index = 2
				for (const reserva of items) {
					const row = worksheet.getRow(index)
					row.getCell(1).value = reserva._id
					row.getCell(2).value = reserva.nomeEvento
					row.getCell(3).value = reserva.tipoEvento
					row.getCell(4).value = reserva.audNome
					row.getCell(5).value = reserva.audCoord
					row.getCell(6).value = reserva.instResponsavel
					row.getCell(7).value = reserva.nomeResponsavel
					row.getCell(8).value = reserva.emailResponsavel
					row.getCell(9).value = reserva.telefoneResponsavel
					row.getCell(10).value = reserva.recursosAud
					row.getCell(11).value = reserva.descricao
					row.getCell(12).value = reserva.observacao
					row.getCell(13).value = reserva.solicitadoPor
					row.getCell(14).value = reserva.aceitoPor
					row.getCell(15).value = reserva.status
					row.getCell(16).value = reserva.datas
					index = index + 1
				}
			}
			else { throw { statusCode: 500, statusMessage: 'Erro no servidor', message: 'Não foi possivel gerar o documento' } }

			const buffer = await workbook.xlsx.writeBuffer()
			setResponseHeaders(event, {
				'Content-Disposition': 'attachment; filename=reservas.xlsx',
				'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			})
			return buffer
		}
		throw {
			statusCode: 403,
			statusMessage: 'Proibido',
			message: 'Não autorizado',
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
