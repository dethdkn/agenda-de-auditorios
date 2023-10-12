<script setup lang="ts">
definePageMeta({
	pageTransition: {
		name: 'slide-right',
		mode: 'out-in'
	}
})
const {url} = useRoute().params
const {data, error} = await useFetch('/api/fetch/auditorio', {method: 'post', body: {url}})
if (error.value) {
	const err = (error.value as any).data
	if (err) {
		const {statusCode, statusMessage, message} = err
		throw createError({statusCode, statusMessage, message})
	}
}
if (!data.value)
	throw createError({
		statusCode: 404,
		statusMessage: 'Inexistente',
		message: 'Este auditório não existe'
	})
useHead({
	title: `Agenda de Auditórios - ${data.value.nome}`
})
</script>

<template>
	<section>
		<InfoAuditorio v-if="data" :auditorio="data" />
	</section>
</template>
