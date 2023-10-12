<script setup lang="ts">
definePageMeta({
	pageTransition: {
		name: 'slide-right',
		mode: 'out-in'
	}
})
useHead({
	title: `Agenda de Auditórios`
})
</script>

<template>
	<section>
		<CardAuditorios />
	</section>
</template>
