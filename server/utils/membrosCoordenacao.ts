import {ldapClient} from './ldapClient'
import {Erro} from './mongoose'
import limparMembros from './limparMembros'
const {LDAP_COORDINATIONS_DN} = useRuntimeConfig().public

export default (cn: string): Promise<string[]> => {
	return new Promise((resolve, reject) => {
		let members: string[] = []
		ldapClient.search(
			`cn=${cn}, ${LDAP_COORDINATIONS_DN}`,
			{attributes: ['member']},
			(err, res) => {
				if (err) {
					new Erro({
						erro: {
							info: 'Erro na busca de membros de uma coordenação',
							cn,
							err
						}
					}).save()
					return reject('Erro ao baixar membros das coordenações')
				}
				res.on('searchEntry', (entry) => {
					members = entry.pojo.attributes[0].values
				})
				res.on('error', (error) => {
					new Erro({
						erro: {
							info: 'Erro na busca de membros de uma coordenação',
							cn,
							error
						}
					}).save()
					return reject('Erro ao baixar membros das coordenações')
				})
				res.on('end', () => {
					return resolve(limparMembros(members))
				})
			}
		)
	})
}
