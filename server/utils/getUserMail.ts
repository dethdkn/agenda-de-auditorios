const { LDAP_PEOPLE_DN } = useRuntimeConfig()

export default (uid: string): Promise<string> => {
	return new Promise((resolve, reject) => {
		let mail: string = ''
		ldapClient.search(`uid=${uid}, ${LDAP_PEOPLE_DN}`, { attributes: ['mail'] }, (err, res) => {
			if (err) {
				new Erro({
					erro: {
						info: 'Erro na busca de usuario no ldap',
						uid,
						err,
					},
				}).save()
				return reject('Erro ao baixar usuário')
			}
			res.on('searchEntry', (entry) => {
				mail = entry.pojo.attributes[0].values[0]
			})
			res.on('error', (error) => {
				new Erro({
					erro: {
						info: 'Erro na busca de usuario no ldap',
						uid,
						error,
					},
				}).save()
				return reject('Erro ao baixar usuário')
			})
			res.on('end', () => {
				return resolve(mail)
			})
		})
	})
}
