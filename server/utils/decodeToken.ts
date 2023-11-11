import jwt from 'jsonwebtoken'

const { JWT } = useRuntimeConfig()

export default (tokenCrypt: string): Promise<TokenUsuario | null> => {
	return new Promise((resolve) => {
		jwt.verify(tokenCrypt, JWT, (err, decoded) => {
			if (!err && decoded)
				return resolve(decoded as TokenUsuario)
			return resolve(null)
		})
	})
}
