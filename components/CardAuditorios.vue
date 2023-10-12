<script setup lang="ts">
const {data: auditorios, error} = await useFetch('/api/fetch/auditorios')
if (error.value) {
	const err = (error.value as any).data
	if (err) {
		const {statusCode, statusMessage, message} = err
		throw createError({statusCode, statusMessage, message})
	}
}
</script>

<template>
	<UCard
		class="w-full min-h-[calc(100vh-131px)]"
		:ui="{
			base: '',
			ring: '',
			divide: '',
			header: {padding: 'px-4 py-3'},
			rounded: '',
			body: {padding: '', base: 'divide-y divide-gray-200 dark:divide-gray-700'},
			footer: {padding: 'p-4'}
		}"
	>
		<div
			class="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 place-items-center"
		>
			<div
				v-if="auditorios"
				v-for="(auditorio, i) in auditorios"
				:key="auditorio.url"
				class="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
			>
				<img
					v-if="auditorio.fotos && auditorio.fotos[0]"
					class="rounded-t-lg cursor-pointer"
					:src="`/foto?f=${auditorio.fotos[0]}`"
					:alt="auditorio.nome"
					loading="lazy"
					@click="navigateTo('auditorio/' + auditorio.url)"
				/>
				<img
					v-else
					class="rounded-t-lg cursor-pointer"
					src="~/assets/images/nopic_aud.webp"
					:alt="auditorio.nome"
					loading="lazy"
					@click="navigateTo('auditorio/' + auditorio.url)"
				/>
				<div class="p-5">
					<h5
						class="mb-2 text-2xl font-bold tracking-tight text-gray-900 cursor-pointer dark:text-white"
						@click="navigateTo('auditorio/' + auditorio.url)"
					>
						{{ auditorio.nome }}
					</h5>
					<p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
						{{ auditorio.descricao }}
					</p>
					<UButton
						:to="'auditorio/' + auditorio.url"
						icon="i-heroicons-arrow-right"
						size="sm"
						variant="solid"
						label="Saiba Mais"
						trailing
					/>
				</div>
			</div>
		</div>
	</UCard>
</template>
