import jwt from 'jsonwebtoken'
const {JWT} = useRuntimeConfig().public

export default defineEventHandler(async (event) => {
	let decodedToken: TokenUsuario | null = null
	const userCookie = getCookie(event, 'user') || ''
	if (userCookie) {
		const token = JSON.parse(userCookie).token
		if (token) decodedToken = await decodeToken(token)
	}
	if (decodedToken) {
		event.context.user = decodedToken
	} else {
		event.context.user = null
	}
})

const decodeToken = (tokenCrypt: string): Promise<TokenUsuario | null> => {
	return new Promise((resolve) => {
		jwt.verify(tokenCrypt, JWT, (err, decoded) => {
			if (!err && decoded) return resolve(decoded as TokenUsuario)
			return resolve(null)
		})
	})
}
