import mongoose from 'mongoose'

const { Schema } = mongoose
const { MONGO_URL, MONGO_USERNAME, MONGO_PASSWORD, MONGO_DB_NAME } = useRuntimeConfig()

mongoose.connect(MONGO_URL, {
	tls: false,
	authMechanism: 'SCRAM-SHA-1',
	auth: {
		username: MONGO_USERNAME,
		password: MONGO_PASSWORD,
	},
	dbName: MONGO_DB_NAME,
})

export const Erro = mongoose.model(
	'erro',
	new Schema({
		erro: { type: Object, required: true },
		data: { type: Date, default: new Date() },
	}),
)

export const Log = mongoose.model(
	'log',
	new Schema({
		usuario: { type: String, required: true },
		acao: { type: String, required: true },
		data: { type: Date, default: new Date() },
	}),
)

export const Auditorio = mongoose.model(
	'auditorio',
	new Schema<Auditorio>({
		nome: { type: String, required: true },
		capacidade: { type: String, required: true },
		coordenacao: { type: String, required: true },
		itens: [{ type: String }],
		descricao: String,
		url: { type: String, required: true },
		fotos: [{ type: String, default: [] }],
		planta: String,
	}),
)

export const Externo = mongoose.model(
	'externo',
	new Schema<UsuarioExterno>({
		email: { type: String, required: true },
		instituicao: { type: String, required: true },
		senha: { type: String, required: true },
	}),
)

export const Instituicao = mongoose.model(
	'instituicoe',
	new Schema<Instituicoes>({
		nome: { type: String, required: true },
	}),
)

export const TipoEvento = mongoose.model(
	'tipo',
	new Schema<TiposEventos>({
		nome: { type: String, required: true },
	}),
)

export const Reserva = mongoose.model(
	'reserva',
	new Schema<Reserva>({
		audNome: { type: String, required: true },
		audCoord: { type: String, required: true },
		nomeEvento: { type: String, required: true },
		tipoEvento: { type: String, required: true },
		instResponsavel: { type: String, required: true },
		nomeResponsavel: { type: String, required: true },
		emailResponsavel: { type: String, required: true },
		telefoneResponsavel: { type: String, required: true },
		datas: [
			{
				type: new Schema({
					data: { type: Date, required: true },
					inicio: { type: String, required: true },
					fim: { type: String, required: true },
				}),
				required: true,
			},
		],
		recursosAud: [{ type: String, default: [] }],
		descricao: { type: String, required: true },
		observacao: String,
		solicitadoPor: { type: String, required: true },
		aceitoPor: String,
		status: {
			type: String,
			enum: ['Aguardando', 'Aprovado', 'Recusado', 'Cancelado'],
			required: true,
		},
	}),
)

export const Email = mongoose.model(
	'email',
	new Schema<Email>({
		email: { type: String, required: true },
		auditorios: [{ type: String, default: [] }],
	}),
)
