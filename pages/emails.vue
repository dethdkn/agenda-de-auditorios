<script setup lang="ts">
definePageMeta({
	middleware: 'is-authenticated',
	pageTransition: {
		name: 'slide-left',
		mode: 'out-in',
	},
})
useHead({
	title: 'Emails',
})
</script>

<template>
	<section>
		<TableEmails />
	</section>
</template>
