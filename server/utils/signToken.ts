import jwt from 'jsonwebtoken'
const {JWT} = useRuntimeConfig().public

export default (obj: TokenUsuario): string => {
	return jwt.sign(obj, JWT, {expiresIn: '8h'})
}
