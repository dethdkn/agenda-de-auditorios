import process from 'node:process'

const {
	DEV_MODE,
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
	MAIL_PORT,
	DEV_URL,
	DEV_KEY,
	DEV_CERT,
} = process.env
export default defineNuxtConfig({
	css: ['~/assets/sass/global.sass', 'v-calendar/style.css', 'vue3-carousel/dist/carousel.css'],
	modules: [
		'@nuxt/ui',
		'@nuxt/image',
		'@vueuse/nuxt',
		'@pinia/nuxt',
		'@pinia-plugin-persistedstate/nuxt',
		'@nuxtseo/module',
		'nuxt-gtag',
	],
	site: {
		url: SITE_URL,
		name: 'Agenda de Auditórios',
		description:
			'Explore nossos auditórios. Descubra espaços de conferência modernos e versáteis com fotos detalhadas. Encontre o local ideal para seu próximo evento ou reunião de alto nível.',
		defaultLocale: 'pt-BR',
		identity: {
			type: 'Organization',
		},
		twitter: '@cbpf_mcti',
	},
	robots: {
		disallow: ['/auditorios', '/usuarios', '/solicitar-reserva', '/reservas'],
	},
	sitemap: {
		sitemapName: 'sitemap.xml',
	},
	gtag: {
		id: 'G-15N4KGX582',
	},
	colorMode: {
		fallback: 'dark',
		preference: 'dark',
	},
	runtimeConfig: {
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
		MAIL_PORT,
		public: {
			DEV_MODE,
			SITE_URL,
		},
	},
	app: {
		pageTransition: {
			name: 'slide-left',
			mode: 'out-in',
		},
	},
	devServer: {
		host: DEV_URL,
		https: {
			key: DEV_KEY,
			cert: DEV_CERT,
		},
	},
	devtools: {
		enabled: true,
		timeline: { enabled: true },
	},
})
