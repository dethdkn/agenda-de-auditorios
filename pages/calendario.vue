<script setup lang="ts">
definePageMeta({
	pageTransition: {
		name: 'slide-left',
		mode: 'out-in'
	}
})
useHead({
	title: `Agenda de Auditórios - Calendário`
})
</script>

<template>
	<section>
		<VCalendario />
	</section>
</template>
