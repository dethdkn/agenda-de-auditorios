import mailerClient from './mailerClient'
import {Erro} from './mongoose'
import isEmail from './isEmail'
import fetchInternos from './fetchInternos'
const {DEV_MODE} = useRuntimeConfig().public

export default (
	status: 'Aprovado' | 'Recusado' | 'Aguardando' | 'Cancelado',
	solicitante: string | string[],
	audNome: string,
	audCoord: string,
	nomeEvento: string,
	tipoEvento: string,
	instResponsavel: string,
	nomeResponsavel: string,
	emailResponsavel: string,
	telefoneResponsavel: string,
	datas: {data: Date; inicio: string; fim: string}[],
	recursosSolicitados: string[],
	descricao: string,
	observacao?: string
): Promise<void> => {
	return new Promise(async (resolve, reject) => {
		const usuarios = await fetchInternos()
		const dadosMail = {
			from: 'auditorios@cbpf.br',
			to: [emailResponsavel],
			subject: '[🎤 Auditórios] ',
			html: '<style>body{font-family:Arial,sans-serif;margin:0;padding:20px}h1{text-align:center;}h2{text-align:center;}table{width:100%;border-collapse:collapse;margin-top:20px}table,th,td{border:1px solid #ddd}th,td{padding:10px;text-align:left}th{background-color:#333;color:white}</style>'
		}
		if (typeof solicitante === 'string') {
			dadosMail.to.push(isEmail(solicitante) ? solicitante : await getUserMail(solicitante))
		} else {
			for (const solic of solicitante)
				dadosMail.to.push(isEmail(solic) ? solic : await getUserMail(solic))
		}
		const datasReserva: string[] = []
		for (const data of datas) datasReserva.push(data.data.toLocaleDateString('pt-br'))
		if (status === 'Aprovado') {
			if (DEV_MODE === 'false') {
				dadosMail.to.push('saa@cbpf.br')
				dadosMail.to.push('portaria@cbpf.br')
			}
			for (const usuario of usuarios) {
				if (usuario.nivel === 'Administrador') dadosMail.to.push(`${usuario.idcbpf}@cbpf.br`)
				if (usuario.nivel === 'Técnico') dadosMail.to.push(`${usuario.idcbpf}@cbpf.br`)
				if (usuario.nivel === 'Gerente' && usuario.coordenacao.includes(audCoord))
					dadosMail.to.push(`${usuario.idcbpf}@cbpf.br`)
			}
			dadosMail.subject =
				dadosMail.subject + `Reserva Aprovada - ${audNome} | ${datasReserva.join(' | ')}`
			let datasTexto = `<ul>`
			for (const data of datas)
				datasTexto =
					datasTexto +
					`<li>${data.data.toLocaleDateString('pt-br')} das ${data.inicio} às ${data.fim}</li>`
			datasTexto = datasTexto + `</ul>`
			let recursosTexto = `<ul>`
			for (const recurso of recursosSolicitados)
				recursosTexto = recursosTexto + `<li>${recurso}</li>`
			recursosTexto = recursosTexto + `</ul>`
			dadosMail.html =
				dadosMail.html +
				`
                    <h1>Reserva Aprovada</h1>
                    <h2>${audNome}</h2>
                    <table>
                        <tr>
                            <th>Campo</th>
                            <th>Informação</th>
                        </tr>
                        <tr>
                            <td><strong>Nome do Evento</strong></td>
                            <td>${nomeEvento}</td>
                        </tr>
                        <tr>
                            <td><strong>Tipo do Evento</strong></td>
                            <td>${tipoEvento}</td>
                        </tr>
                        <tr>
                            <td><strong>Instituição Responsável</strong></td>
                            <td>${instResponsavel}</td>
                        </tr>
                        <tr>
                            <td><strong>Nome do Responsável</strong></td>
                            <td>${nomeResponsavel}</td>
                        </tr>
                        <tr>
                            <td><strong>E-mail do Responsável</strong></td>
                            <td>${emailResponsavel}</td>
                        </tr>
                        <tr>
                            <td><strong>Telefone do Responsável</strong></td>
                            <td>${telefoneResponsavel}</td>
                        </tr>
                        <tr>
                            <td><strong>Datas/Horas</strong></td>
                            <td>${datasTexto}</td>
                        </tr>
                        <tr>
                            <td><strong>Recursos Solicitados</strong></td>
                            <td>${recursosTexto}</td>
                        </tr>
                    </table>
                    <p><strong>Descrição:</strong></p>
                    <p>${descricao}</p>
                    <p><strong>Observações:</strong></p>
                    <p>${observacao}</p>
                    <br>
                    <p>Acesse <a href="https://auditorios.cbpf.br">auditorios.cbpf.br</a> para detalhes</p>
            `
		} else if (status === 'Recusado') {
			for (const usuario of usuarios) {
				if (usuario.nivel === 'Administrador') dadosMail.to.push(`${usuario.idcbpf}@cbpf.br`)
				if (usuario.nivel === 'Gerente' && usuario.coordenacao.includes(audCoord))
					dadosMail.to.push(`${usuario.idcbpf}@cbpf.br`)
			}
			dadosMail.subject =
				dadosMail.subject + `Reserva Recusada - ${audNome} | ${datasReserva.join(' | ')}`
			let datasTexto = `<ul>`
			for (const data of datas)
				datasTexto =
					datasTexto +
					`<li>${data.data.toLocaleDateString('pt-br')} das ${data.inicio} às ${data.fim}</li>`
			datasTexto = datasTexto + `</ul>`
			let recursosTexto = `<ul>`
			for (const recurso of recursosSolicitados)
				recursosTexto = recursosTexto + `<li>${recurso}</li>`
			recursosTexto = recursosTexto + `</ul>`
			dadosMail.html =
				dadosMail.html +
				`
                    <h1>Reserva Recusada</h1>
                    <h2>${audNome}</h2>
                    <table>
                        <tr>
                            <th>Campo</th>
                            <th>Informação</th>
                        </tr>
                        <tr>
                            <td><strong>Nome do Evento</strong></td>
                            <td>${nomeEvento}</td>
                        </tr>
                        <tr>
                            <td><strong>Tipo do Evento</strong></td>
                            <td>${tipoEvento}</td>
                        </tr>
                        <tr>
                            <td><strong>Instituição Responsável</strong></td>
                            <td>${instResponsavel}</td>
                        </tr>
                        <tr>
                            <td><strong>Nome do Responsável</strong></td>
                            <td>${nomeResponsavel}</td>
                        </tr>
                        <tr>
                            <td><strong>E-mail do Responsável</strong></td>
                            <td>${emailResponsavel}</td>
                        </tr>
                        <tr>
                            <td><strong>Telefone do Responsável</strong></td>
                            <td>${telefoneResponsavel}</td>
                        </tr>
                        <tr>
                            <td><strong>Datas/Horas</strong></td>
                            <td>${datasTexto}</td>
                        </tr>
                        <tr>
                            <td><strong>Recursos Solicitados</strong></td>
                            <td>${recursosTexto}</td>
                        </tr>
                    </table>
                    <p><strong>Descrição:</strong></p>
                    <p>${descricao}</p>
                    <p><strong>Observações:</strong></p>
                    <p>${observacao}</p>
                    <br>
                    <p>Acesse <a href="https://auditorios.cbpf.br">auditorios.cbpf.br</a> para detalhes</p>
            `
		} else if (status === 'Aguardando') {
			for (const usuario of usuarios) {
				if (usuario.nivel === 'Administrador') dadosMail.to.push(`${usuario.idcbpf}@cbpf.br`)
				if (usuario.nivel === 'Gerente' && usuario.coordenacao.includes(audCoord))
					dadosMail.to.push(`${usuario.idcbpf}@cbpf.br`)
			}
			dadosMail.subject =
				dadosMail.subject + `Solicitação de Reserva - ${audNome} | ${datasReserva.join(' | ')}`
			let datasTexto = `<ul>`
			for (const data of datas)
				datasTexto =
					datasTexto +
					`<li>${data.data.toLocaleDateString('pt-br')} das ${data.inicio} às ${data.fim}</li>`
			datasTexto = datasTexto + `</ul>`
			let recursosTexto = `<ul>`
			for (const recurso of recursosSolicitados)
				recursosTexto = recursosTexto + `<li>${recurso}</li>`
			recursosTexto = recursosTexto + `</ul>`
			dadosMail.html =
				dadosMail.html +
				`
                    <h1>Solicitação de Reserva</h1>
                    <h2>Aguardando Aprovação</h2>
                    <h2>${audNome}</h2>
                    <table>
                        <tr>
                            <th>Campo</th>
                            <th>Informação</th>
                        </tr>
                        <tr>
                            <td><strong>Nome do Evento</strong></td>
                            <td>${nomeEvento}</td>
                        </tr>
                        <tr>
                            <td><strong>Tipo do Evento</strong></td>
                            <td>${tipoEvento}</td>
                        </tr>
                        <tr>
                            <td><strong>Instituição Responsável</strong></td>
                            <td>${instResponsavel}</td>
                        </tr>
                        <tr>
                            <td><strong>Nome do Responsável</strong></td>
                            <td>${nomeResponsavel}</td>
                        </tr>
                        <tr>
                            <td><strong>E-mail do Responsável</strong></td>
                            <td>${emailResponsavel}</td>
                        </tr>
                        <tr>
                            <td><strong>Telefone do Responsável</strong></td>
                            <td>${telefoneResponsavel}</td>
                        </tr>
                        <tr>
                            <td><strong>Datas/Horas</strong></td>
                            <td>${datasTexto}</td>
                        </tr>
                        <tr>
                            <td><strong>Recursos Solicitados</strong></td>
                            <td>${recursosTexto}</td>
                        </tr>
                    </table>
                    <p><strong>Descrição:</strong></p>
                    <p>${descricao}</p>
                    <p><strong>Observações:</strong></p>
                    <p>${observacao}</p>
                    <br>
                    <p>Acesse <a href="https://auditorios.cbpf.br">auditorios.cbpf.br</a> para detalhes</p>
            `
		} else if (status === 'Cancelado') {
			if (DEV_MODE === 'false') {
				dadosMail.to.push('saa@cbpf.br')
				dadosMail.to.push('portaria@cbpf.br')
			}
			for (const usuario of usuarios) {
				if (usuario.nivel === 'Administrador') dadosMail.to.push(`${usuario.idcbpf}@cbpf.br`)
				if (usuario.nivel === 'Técnico') dadosMail.to.push(`${usuario.idcbpf}@cbpf.br`)
				if (usuario.nivel === 'Gerente' && usuario.coordenacao.includes(audCoord))
					dadosMail.to.push(`${usuario.idcbpf}@cbpf.br`)
			}
			dadosMail.subject =
				dadosMail.subject + `Reserva Cancelada - ${audNome} | ${datasReserva.join(' | ')}`
			let datasTexto = `<ul>`
			for (const data of datas)
				datasTexto =
					datasTexto +
					`<li>${data.data.toLocaleDateString('pt-br')} das ${data.inicio} às ${data.fim}</li>`
			datasTexto = datasTexto + `</ul>`
			let recursosTexto = `<ul>`
			for (const recurso of recursosSolicitados)
				recursosTexto = recursosTexto + `<li>${recurso}</li>`
			recursosTexto = recursosTexto + `</ul>`
			dadosMail.html =
				dadosMail.html +
				`
                    <h1>Reserva Cancelada</h1>
                    <h2>${audNome}</h2>
                    <table>
                        <tr>
                            <th>Campo</th>
                            <th>Informação</th>
                        </tr>
                        <tr>
                            <td><strong>Nome do Evento</strong></td>
                            <td>${nomeEvento}</td>
                        </tr>
                        <tr>
                            <td><strong>Tipo do Evento</strong></td>
                            <td>${tipoEvento}</td>
                        </tr>
                        <tr>
                            <td><strong>Instituição Responsável</strong></td>
                            <td>${instResponsavel}</td>
                        </tr>
                        <tr>
                            <td><strong>Nome do Responsável</strong></td>
                            <td>${nomeResponsavel}</td>
                        </tr>
                        <tr>
                            <td><strong>E-mail do Responsável</strong></td>
                            <td>${emailResponsavel}</td>
                        </tr>
                        <tr>
                            <td><strong>Telefone do Responsável</strong></td>
                            <td>${telefoneResponsavel}</td>
                        </tr>
                        <tr>
                            <td><strong>Datas/Horas</strong></td>
                            <td>${datasTexto}</td>
                        </tr>
                        <tr>
                            <td><strong>Recursos Solicitados</strong></td>
                            <td>${recursosTexto}</td>
                        </tr>
                    </table>
                    <p><strong>Descrição:</strong></p>
                    <p>${descricao}</p>
                    <p><strong>Observações:</strong></p>
                    <p>${observacao}</p>
                    <br>
                    <p>Acesse <a href="https://auditorios.cbpf.br">auditorios.cbpf.br</a> para detalhes</p>
            `
		} else {
			return reject('status do auditório inválido')
		}
		mailerClient.sendMail(dadosMail, (error) => {
			if (error) {
				new Erro({
					erro: {
						info: 'Erro ao enviar e-mail',
						error
					}
				}).save()
				return reject('Erro ao enviar e-mail')
			}
			return resolve()
		})
	})
}
