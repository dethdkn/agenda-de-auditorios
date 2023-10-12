import ldapjs from 'ldapjs'
const {LDAP_URL, LDAP_DN, LDAP_PASSWORD} = useRuntimeConfig().public

export const ldapClient = ldapjs.createClient({
	url: LDAP_URL,
	reconnect: {initialDelay: 100, maxDelay: 500, failAfter: Infinity}
})
ldapClient.bind(LDAP_DN, LDAP_PASSWORD, () => {})

ldapClient.on('resultError', () => {
	ldapClient.bind(LDAP_DN, LDAP_PASSWORD, () => {})
})
