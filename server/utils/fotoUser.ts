import { Buffer } from 'node:buffer'

const { LDAP_PEOPLE_DN } = useRuntimeConfig()

export default (uid: string): Promise<string> => {
	return new Promise((resolve, reject) => {
		let foto = ''
		ldapClient.search(`uid=${uid}, ${LDAP_PEOPLE_DN}`, { attributes: ['jpegPhoto'] }, (err, res) => {
			if (err) {
				new Erro({
					erro: {
						info: 'Erro ao buscar foto do usuario no ldap',
						uid,
						err,
					},
				}).save()
				return reject('Erro ao baixar foto de perfil do usuário')
			}
			res.on('searchEntry', (entry) => {
				if (entry.attributes[0] && entry.attributes[0].buffers) {
					const binary = entry.attributes[0].buffers
					if (binary)
						foto = Buffer.concat(binary).toString('base64')
				}
			})
			res.on('error', (error) => {
				new Erro({
					erro: {
						info: 'Erro ao buscar foto do usuario no ldap',
						uid,
						error,
					},
				}).save()
				return reject('Erro ao baixar foto de perfil do usuário')
			})
			res.on('end', () => {
				resolve(foto)
			})
		})
	})
}
