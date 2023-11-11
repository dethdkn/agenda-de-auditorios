<script setup lang="ts">
definePageMeta({
	pageTransition: {
		name: 'slide-left',
		mode: 'out-in',
	},
})
useHead({
	title: 'Calendário',
})
defineOgImage({
	title: `Agenda de Auditórios | Calendário`,
	component: 'Og',
})
useSeoMeta({
	description:
		'O Calendário de Reuniões e Eventos do CBPF é a sua fonte para acompanhar todas as datas importantes do Centro Brasileiro de Pesquisas Físicas. Fique por dentro das atividades científicas, conferências e eventos especiais que ocorrem no CBPF. Junte-se à comunidade científica e explore as oportunidades de aprendizado e networking em um único lugar.',
})
</script>

<template>
	<section>
		<VCalendario />
	</section>
</template>
