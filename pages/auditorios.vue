<script setup lang="ts">
definePageMeta({
	middleware: 'is-authenticated',
	pageTransition: {
		name: 'slide-left',
		mode: 'out-in',
	},
})
useHead({
	title: 'Auditórios',
})
</script>

<template>
	<section>
		<TableAuditorios />
	</section>
</template>
