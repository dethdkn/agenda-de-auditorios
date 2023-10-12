<script setup lang="ts">
definePageMeta({
	middleware: 'is-authenticated',
	pageTransition: {
		name: 'slide-left',
		mode: 'out-in'
	}
})
useHead({
	title: `Agenda de Auditórios - Solicitar Reserva`
})
</script>

<template>
	<section>
		<NovaReserva />
	</section>
</template>
