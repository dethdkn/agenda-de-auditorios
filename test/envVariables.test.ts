import {it, expect} from 'vitest'

const {
	SITE_URL,
	IMAGES_PATH,
	JWT,
	MONGO_URL,
	MONGO_USERNAME,
	MONGO_PASSWORD,
	MONGO_DB_NAME,
	LDAP_URL,
	LDAP_DN,
	LDAP_PASSWORD,
	LDAP_PEOPLE_DN,
	LDAP_GROUPS_DN,
	LDAP_COORDINATIONS_DN,
	MAIL_HOST,
	MAIL_PORT
} = useRuntimeConfig().public

it('Variável de ambiente SITE_URL deveria estar definida', async () => {
	expect(SITE_URL).toBeDefined()
})

it('Variável de ambiente IMAGES_PATH deveria estar definida', async () => {
	expect(IMAGES_PATH).toBeDefined()
})

it('Variável de ambiente JWT deveria estar definida', async () => {
	expect(JWT).toBeDefined()
})

it('Variável de ambiente MONGO_URL deveria estar definida', async () => {
	expect(MONGO_URL).toBeDefined()
})

it('Variável de ambiente MONGO_USERNAME deveria estar definida', async () => {
	expect(MONGO_USERNAME).toBeDefined()
})

it('Variável de ambiente MONGO_PASSWORD deveria estar definida', async () => {
	expect(MONGO_PASSWORD).toBeDefined()
})

it('Variável de ambiente MONGO_DB_NAME deveria estar definida', async () => {
	expect(MONGO_DB_NAME).toBeDefined()
})

it('Variável de ambiente LDAP_URL deveria estar definida', async () => {
	expect(LDAP_URL).toBeDefined()
})

it('Variável de ambiente LDAP_DN deveria estar definida', async () => {
	expect(LDAP_DN).toBeDefined()
})

it('Variável de ambiente LDAP_PASSWORD deveria estar definida', async () => {
	expect(LDAP_PASSWORD).toBeDefined()
})

it('Variável de ambiente LDAP_PEOPLE_DN deveria estar definida', async () => {
	expect(LDAP_PEOPLE_DN).toBeDefined()
})

it('Variável de ambiente LDAP_GROUPS_DN deveria estar definida', async () => {
	expect(LDAP_GROUPS_DN).toBeDefined()
})

it('Variável de ambiente LDAP_COORDINATIONS_DN deveria estar definida', async () => {
	expect(LDAP_COORDINATIONS_DN).toBeDefined()
})

it('Variável de ambiente MAIL_HOST deveria estar definida', async () => {
	expect(MAIL_HOST).toBeDefined()
})

it('Variável de ambiente MAIL_PORT deveria estar definida', async () => {
	expect(MAIL_PORT).toBeDefined()
})
