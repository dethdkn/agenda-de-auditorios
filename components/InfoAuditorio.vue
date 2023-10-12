<script setup lang="ts">
const {auditorio} = defineProps({
	auditorio: {
		type: Object as () => {
			nome: string
			capacidade: string
			coordenacao: string
			itens: string[]
			descricao?: string
			url: string
			fotos: string[]
			planta?: string
		},
		required: true
	}
})
const {width} = useWindowSize()
const currentSlide = ref(0)
const fotosPrincipal = computed(() => {
	const fotos = auditorio.fotos.map(
		(foto) =>
			`<img class="h-[calc(70vh-310px)] rounded-lg" src="/foto?f=${foto}" alt="Foto do Auditório ${auditorio.nome}">`
	)
	if (auditorio.planta)
		fotos.push(
			`<img class="h-[calc(70vh-310px)] rounded-lg" src="/foto?f=${auditorio.planta}" alt="Planta do Auditório ${auditorio.nome}">`
		)
	return fotos
})
const fotosSlide = computed(() => {
	const fotos = auditorio.fotos.map(
		(foto) =>
			`<img class="max-w-xs rounded-lg cursor-move" src="/foto?f=${foto}" alt="Foto do Auditório ${auditorio.nome}">`
	)
	if (auditorio.planta)
		fotos.push(
			`<img class="max-w-xs rounded-lg cursor-move" src="/foto?f=${auditorio.planta}" alt="Planta do Auditório ${auditorio.nome}">`
		)
	return fotos
})
setInterval(() => {
	currentSlide.value = currentSlide.value + 1
}, 10000)
</script>

<template>
	<UCard
		class="w-full min-h-[calc(100vh-131px)]"
		:ui="{
			base: '',
			ring: '',
			divide: 'divide-y divide-gray-200 dark:divide-gray-700',
			header: {padding: 'px-4'},
			rounded: '',
			body: {padding: 'py-5'}
		}"
	>
		<template #header>
			<h2
				class="pt-3 text-2xl font-semibold leading-tight text-center text-gray-900 dark:text-white"
			>
				{{ auditorio.nome }}
			</h2>
			<div class="grid grid-cols-1 gap-4 my-4 sm:grid-cols-2 md:grid-cols-3 place-items-center">
				<p><span class="font-bold">Coordenação: </span>{{ auditorio.coordenacao }}</p>
				<p><span class="font-bold">Capacidade: </span>{{ auditorio.capacidade }}</p>
				<p>
					<span class="font-bold">Itens: </span>
					<span v-if="auditorio.itens.length > 0">{{ auditorio.itens.join(', ') }}</span>
					<span v-else>-</span>
				</p>
				<p
					v-if="auditorio.descricao"
					class="w-full col-span-1 text-center sm:col-span-2 md:col-span-3"
				>
					<span class="font-bold">Descrição: </span>{{ auditorio.descricao }}
				</p>
			</div>
		</template>
		<div v-if="fotosPrincipal.length < 1" class="text-center">
			Nenhuma foto cadastrada neste auditório
		</div>
		<div v-else-if="width > 1350">
			<Carousel :items-to-show="1" :wrap-around="false" v-model="currentSlide">
				<Slide v-for="slide in fotosPrincipal" :key="slide">
					<div class="carousel__item" v-html="slide" />
				</Slide>
			</Carousel>
			<Carousel
				:items-to-show="4"
				:wrap-around="true"
				v-model="currentSlide"
				ref="carousel"
				class="mt-5"
			>
				<Slide v-for="(slide, i) in fotosSlide" :key="slide">
					<div class="carousel__item" @click="currentSlide = i" v-html="slide" />
				</Slide>
			</Carousel>
		</div>
		<div v-else class="grid grid-cols-1 gap-4 lg:grid-cols-2 place-items-center">
			<span v-for="foto in fotosPrincipal" :key="foto" v-html="foto" />
		</div>
		<template #footer>
			<div class="flex items-center justify-center space-x-5">
				<UButton
					icon="i-heroicons-arrow-small-left"
					label="Foto Anterior"
					@click="currentSlide = currentSlide - 1"
				/>
				<UButton
					icon="i-heroicons-arrow-small-right"
					label="Próxima Foto"
					trailing
					@click="currentSlide = currentSlide + 1"
				/>
			</div>
		</template>
	</UCard>
</template>
