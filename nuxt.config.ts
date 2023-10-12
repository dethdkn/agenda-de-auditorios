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
	DEV_CERT
} = process.env
export default defineNuxtConfig({
	css: ['~/assets/sass/global.sass', 'v-calendar/style.css', 'vue3-carousel/dist/carousel.css'],
	modules: [
		'@nuxthq/ui',
		'@vueuse/nuxt',
		'@pinia/nuxt',
		'@pinia-plugin-persistedstate/nuxt',
		'nuxt-simple-sitemap',
		'nuxt-simple-robots',
		'nuxt-vitest'
	],
	pinia: {
		autoImports: ['defineStore', 'storeToRefs']
	},
	site: {
		url: SITE_URL
	},
	robots: {
		sitemap: '/sitemap.xml',
		disallow: ['/auditorios', '/usuarios', '/solicitar-reserva', '/reservas'],
		credits: false
	},
	sitemap: {
		sitemapName: 'sitemap.xml',
		credits: false
	},
	colorMode: {
		fallback: 'dark',
		preference: 'dark'
	},
	runtimeConfig: {
		public: {
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
			MAIL_PORT
		}
	},
	app: {
		head: {
			htmlAttrs: {lang: 'pt-BR'},
			title: 'Agenda de Auditórios',
			meta: [
				{'http-equiv': 'X-UA-Compatible', content: 'IE=edge'},
				{name: 'robots', content: 'index, follow'},
				{property: 'og:type', content: 'website'},
				{property: 'og:title', content: 'Agenda de Auditórios'},
				{property: 'twitter:title', content: 'Agenda de Auditórios'},
				{property: 'og:site_name', content: 'Agenda de Auditórios'},
				{property: 'og:url', content: SITE_URL},
				{
					property: 'og:image',
					content: SITE_URL + '/minja.png'
				},
				{
					property: 'twitter:image',
					content: SITE_URL + '/minja.png'
				},
				{property: 'twitter:card', content: 'summary'},
				{property: 'twitter:creator', content: '@cbpf_mcti'},
				{
					name: 'description',
					content:
						'Esta página tem como objetivo disponibilizar a infraestrutura das salas e auditórios de uso comum e proporcionar a reserva online dos mesmos facilitando assim a logistica dos setores envolvidos na realização dos eventos.'
				},
				{
					property: 'og:description',
					content:
						'Esta página tem como objetivo disponibilizar a infraestrutura das salas e auditórios de uso comum e proporcionar a reserva online dos mesmos facilitando assim a logistica dos setores envolvidos na realização dos eventos.'
				},
				{
					property: 'twitter:description',
					content:
						'Esta página tem como objetivo disponibilizar a infraestrutura das salas e auditórios de uso comum e proporcionar a reserva online dos mesmos facilitando assim a logistica dos setores envolvidos na realização dos eventos.'
				}
			],
			link: [
				{rel: 'canonical', href: SITE_URL},
				{
					rel: 'icon',
					href: '/favicon.ico',
					type: 'image/x-icon'
				}
			]
		},
		pageTransition: {name: 'slide-left', mode: 'out-in'}
	},
	devServer: {
		host: DEV_URL,
		https: {
			key: DEV_KEY,
			cert: DEV_CERT
		}
	},
	devtools: {
		enabled: true,
		timeline: {enabled: true}
	}
})
