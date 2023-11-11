<script setup lang="ts">
definePageMeta({
	middleware: 'is-authenticated',
	pageTransition: {
		name: 'slide-left',
		mode: 'out-in',
	},
})
useHead({
	title: 'Reservas',
})
</script>

<template>
	<section>
		<ListaReservas />
	</section>
</template>
