export default (senha: string): boolean => {
	return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-=_+[\]{}|\\,./<>?]).{8,}$/.test(senha)
}
