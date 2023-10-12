export default defineNuxtRouteMiddleware(async (to, from) => {
	if (to.meta.pageTransition && typeof to.meta.pageTransition === 'object') {
		const indexTo = usePagesIndexes.indexOf(to.fullPath)
		const indexFrom = usePagesIndexes.indexOf(from.fullPath)
		to.meta.pageTransition.name = indexTo < indexFrom ? 'slide-right' : 'slide-left'
	}
})
