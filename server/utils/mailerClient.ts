import { createTransport } from 'nodemailer'

const { MAIL_HOST, MAIL_PORT } = useRuntimeConfig()

export default createTransport({
	host: MAIL_HOST,
	port: Number(MAIL_PORT),
	secure: false,
})
