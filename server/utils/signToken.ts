import jwt from 'jsonwebtoken'

const { JWT } = useRuntimeConfig()

export default (obj: TokenUsuario): string => {
	return jwt.sign(obj, JWT, { expiresIn: '8h' })
}
