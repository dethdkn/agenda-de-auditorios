<script setup lang="ts">
definePageMeta({
	pageTransition: {
		name: 'slide-right',
		mode: 'out-in',
	},
})
defineOgImage({
	title: `Agenda de Auditórios`,
	component: 'Og',
})
useSeoMeta({
	description:
		'Explore nossos auditórios. Descubra espaços de conferência modernos e versáteis com fotos detalhadas. Encontre o local ideal para seu próximo evento ou reunião de alto nível.',
})
</script>

<template>
	<section>
		<CardAuditorios />
	</section>
</template>
