<script setup lang="ts">
definePageMeta({
	middleware: 'is-authenticated',
	pageTransition: {
		name: 'slide-left',
		mode: 'out-in',
	},
})
useHead({
	title: 'Usuários',
})
</script>

<template>
	<section>
		<TableUsuarios />
	</section>
</template>
