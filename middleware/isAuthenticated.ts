export default defineNuxtRouteMiddleware(async (to) => {
	if (await useCheckAuth()) {
		if (['Administrador'].includes(userStore().level)) {
			if (['/auditorios', '/usuarios', '/solicitar-reserva', '/reservas'].includes(to.fullPath))
				return
			return navigateTo('/')
		} else if (['Gerente'].includes(userStore().level)) {
			if (['/solicitar-reserva', '/reservas'].includes(to.fullPath)) return
			return navigateTo('/')
		} else if (['Secretária', 'Externo'].includes(userStore().level)) {
			if (['/solicitar-reserva', '/reservas'].includes(to.fullPath)) return
			return navigateTo('/')
		} else if (['Técnico'].includes(userStore().level)) {
			if (['/reservas'].includes(to.fullPath)) return
			return navigateTo('/')
		} else {
			userStore().clearUserState()
			return navigateTo('/login')
		}
	} else {
		userStore().clearUserState()
		return navigateTo('/login')
	}
})
