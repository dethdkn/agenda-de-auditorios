<script setup lang="ts">
const { SITE_URL } = useRuntimeConfig().public
const { data, error, refresh, pending } = await useFetch('/api/fetch/auditorios')
if (error.value) {
	const err = (error.value as any).data
	if (err) {
		const { statusCode, statusMessage, message } = err
		throw createError({ statusCode, statusMessage, message })
	}
}

const colunas = [
	{
		key: 'id',
		label: 'ID',
		sortable: false,
	},
	{
		key: 'nome',
		label: 'Nome',
		sortable: true,
	},
	{
		key: 'coordenacao',
		label: 'Coordenação',
		sortable: true,
	},
	{
		key: 'capacidade',
		label: 'Capacidade',
		sortable: true,
	},
	{
		key: 'url',
		label: 'URL',
		sortable: true,
	},
	{
		key: 'itens',
		label: 'Itens',
		sortable: true,
	},
	{
		key: 'descricao',
		label: 'Descrição',
		sortable: true,
	},
	{
		key: 'acoes',
		label: 'Ações',
		sortable: false,
	},
]
const pesquisar = ref('')
const audFiltro = computed(() => {
	if (pesquisar.value && data.value) {
		return data.value.filter((item) => {
			return Object.values(item).some((value) => {
				return String(value).toLowerCase().includes(pesquisar.value.toLowerCase())
			})
		})
	}
	return data.value
})

const modalNovo = ref(false)
const loadingNovo = ref(false)
const nomeNovo = ref('')
const capacidadeNovo = ref('')
const coordenacaoNovo = ref('')
const urlNovo = ref('')
const itensNovo = ref('')
const descricaoNovo = ref('')
const {
	open: abrirPlantaNovo,
	reset: resetPlantaNovo,
	files: plantaNovo,
} = useFileDialog({ accept: 'image/*' })
watch(modalNovo, (nv) => {
	if (!nv) {
		setTimeout(() => {
			nomeNovo.value = ''
			capacidadeNovo.value = ''
			coordenacaoNovo.value = ''
			urlNovo.value = ''
			itensNovo.value = ''
			descricaoNovo.value = ''
			resetPlantaNovo()
			loadingNovo.value = false
		}, 300)
	}
})
async function criar() {
	loadingNovo.value = true
	if (!nomeNovo.value) {
		useToast().add({
			title: 'Preencha o Nome do Auditório',
			icon: 'i-heroicons-exclamation-circle',
			color: 'amber',
		})
		return (loadingNovo.value = false)
	}
	if (!capacidadeNovo.value) {
		useToast().add({
			title: 'Preencha a Capacidade do Auditório',
			icon: 'i-heroicons-exclamation-circle',
			color: 'amber',
		})
		return (loadingNovo.value = false)
	}
	if (!coordenacaoNovo.value) {
		useToast().add({
			title: 'Selecione a Coordenação do Auditório',
			icon: 'i-heroicons-exclamation-circle',
			color: 'amber',
		})
		return (loadingNovo.value = false)
	}
	if (!urlNovo.value) {
		useToast().add({
			title: 'Preencha a URL do Auditório',
			icon: 'i-heroicons-exclamation-circle',
			color: 'amber',
		})
		return (loadingNovo.value = false)
	}
	const formData = new FormData()
	formData.append('nome', nomeNovo.value)
	formData.append('capacidade', capacidadeNovo.value)
	formData.append('coordenacao', coordenacaoNovo.value)
	formData.append('url', urlNovo.value)
	formData.append('itens', itensNovo.value)
	formData.append('planta', plantaNovo.value && plantaNovo.value[0] ? plantaNovo.value[0] : '')
	formData.append('descricao', descricaoNovo.value)
	const res = await $fetch('/api/insert/auditorio', {
		method: 'POST',
		body: formData,
	}).catch((err) => {
		useToast().add({
			title: err.data.message,
			icon: 'i-heroicons-exclamation-triangle',
			color: 'red',
		})
		modalNovo.value = false
	})
	if (res) {
		refresh()
		modalNovo.value = false
		return useToast().add({
			title: 'Auditório criado com sucesso!',
			icon: 'i-heroicons-check-badge',
			color: 'green',
		})
	}
}

const modalEditar = ref(false)
const loadingEditar = ref(false)
const nomeFixEditar = ref('')
const idEditar = ref('')
const nomeEditar = ref('')
const capacidadeEditar = ref('')
const coordenacaoEditar = ref('')
const urlEditar = ref('')
const itensEditar = ref('')
const descricaoEditar = ref('')
const {
	open: abrirPlantaEditar,
	reset: resetPlantaEditar,
	files: plantaEditar,
} = useFileDialog({ accept: 'image/*' })
watch(modalEditar, (nv) => {
	if (!nv) {
		setTimeout(() => {
			nomeFixEditar.value = ''
			idEditar.value = ''
			nomeEditar.value = ''
			capacidadeEditar.value = ''
			coordenacaoEditar.value = ''
			urlEditar.value = ''
			itensEditar.value = ''
			descricaoEditar.value = ''
			resetPlantaEditar()
			loadingEditar.value = false
		}, 300)
	}
})
function abrirEditar(aud: Auditorio) {
	if (aud._id)
		idEditar.value = aud._id
	nomeFixEditar.value = aud.nome
	nomeEditar.value = aud.nome
	capacidadeEditar.value = aud.capacidade.toString()
	coordenacaoEditar.value = aud.coordenacao
	urlEditar.value = aud.url
	itensEditar.value = aud.itens.join(', ')
	if (aud.descricao)
		descricaoEditar.value = aud.descricao
	modalEditar.value = true
}
async function editar() {
	loadingEditar.value = true
	if (!nomeEditar.value) {
		useToast().add({
			title: 'Preencha o Nome do Auditório',
			icon: 'i-heroicons-exclamation-circle',
			color: 'amber',
		})
		return (loadingEditar.value = false)
	}
	if (!capacidadeEditar.value) {
		useToast().add({
			title: 'Preencha a Capacidade do Auditório',
			icon: 'i-heroicons-exclamation-circle',
			color: 'amber',
		})
		return (loadingEditar.value = false)
	}
	if (!coordenacaoEditar.value) {
		useToast().add({
			title: 'Selecione a Coordenação do Auditório',
			icon: 'i-heroicons-exclamation-circle',
			color: 'amber',
		})
		return (loadingEditar.value = false)
	}
	if (!urlEditar.value) {
		useToast().add({
			title: 'Preencha a URL do Auditório',
			icon: 'i-heroicons-exclamation-circle',
			color: 'amber',
		})
		return (loadingEditar.value = false)
	}
	const formData = new FormData()
	formData.append('id', idEditar.value)
	formData.append('nome', nomeEditar.value)
	formData.append('capacidade', capacidadeEditar.value)
	formData.append('coordenacao', coordenacaoEditar.value)
	formData.append('url', urlEditar.value)
	formData.append('itens', itensEditar.value)
	formData.append(
		'planta',
		plantaEditar.value && plantaEditar.value[0] ? plantaEditar.value[0] : '',
	)
	formData.append('descricao', descricaoEditar.value)
	const res = await $fetch('/api/update/auditorio', {
		method: 'POST',
		body: formData,
	}).catch((err) => {
		useToast().add({
			title: err.data.message,
			icon: 'i-heroicons-exclamation-triangle',
			color: 'red',
		})
		modalEditar.value = false
	})
	if (res) {
		refresh()
		modalEditar.value = false
		return useToast().add({
			title: 'Auditório editado com sucesso!',
			icon: 'i-heroicons-check-badge',
			color: 'green',
		})
	}
}

const modalExcluir = ref(false)
const loadingExcluir = ref(false)
const idExcluir = ref('')
const nomeExcluir = ref('')
watch(modalExcluir, (nv) => {
	if (!nv) {
		setTimeout(() => {
			idExcluir.value = ''
			nomeExcluir.value = ''
			loadingExcluir.value = false
		}, 300)
	}
})
function abrirExcluir(nome: string, id?: string) {
	if (id)
		idExcluir.value = id
	nomeExcluir.value = nome
	modalExcluir.value = true
}
async function excluir() {
	loadingExcluir.value = true
	const res = await $fetch('/api/delete/auditorio', {
		method: 'POST',
		body: {
			id: idExcluir.value,
			nome: nomeExcluir.value,
		},
	}).catch((err) => {
		useToast().add({
			title: err.data.message,
			icon: 'i-heroicons-exclamation-triangle',
			color: 'red',
		})
		modalExcluir.value = false
	})
	if (res) {
		refresh()
		modalExcluir.value = false
		return useToast().add({
			title: 'Auditório excluído com sucesso!',
			icon: 'i-heroicons-check-badge',
			color: 'green',
		})
	}
}

const modalFotos = ref(false)
const loadingFotos = ref(false)
const idFotos = ref('')
const nomeFotos = ref('')
const fotos = ref<string[]>([])
const {
	open: abrirFileFotos,
	reset: resetFileFotos,
	onChange: uploadFileFotos,
} = useFileDialog({ accept: 'image/*', multiple: true })
watch(modalFotos, (nv) => {
	if (!nv) {
		setTimeout(() => {
			idFotos.value = ''
			fotos.value = []
			resetFileFotos()
			loadingFotos.value = false
		}, 300)
	}
})
function abrirFotos(nome: string, id?: string) {
	nomeFotos.value = nome
	if (id)
		idFotos.value = id
	getFotos()
	modalFotos.value = true
}
function getFotos() {
	if (data.value) {
		const auditorioAtual = data.value.find(obj => obj._id === idFotos.value)
		if (auditorioAtual)
			fotos.value = auditorioAtual.fotos
	}
}
uploadFileFotos(async (fotos) => {
	loadingFotos.value = true
	if (fotos) {
		const formData = new FormData()
		formData.append('id', idFotos.value)
		for (const file of fotos)
			formData.append('foto', file)

		const res = await $fetch('/api/insert/fotos', {
			method: 'POST',
			body: formData,
		}).catch((err) => {
			useToast().add({
				title: err.data.message,
				icon: 'i-heroicons-exclamation-triangle',
				color: 'red',
			})
			modalFotos.value = false
		})
		if (res) {
			await refresh()
			getFotos()
			loadingFotos.value = false
			return useToast().add({
				title: 'Foto(s) enviada(s) com sucesso!',
				icon: 'i-heroicons-check-badge',
				color: 'green',
			})
		}
	}
	else {
		loadingFotos.value = false
	}
})
async function principal(index: number) {
	loadingFotos.value = true
	const res = await $fetch('/api/update/foto', {
		method: 'POST',
		body: {
			id: idFotos.value,
			index: index.toString(),
		},
	}).catch((err) => {
		useToast().add({
			title: err.data.message,
			icon: 'i-heroicons-exclamation-triangle',
			color: 'red',
		})
		modalFotos.value = false
	})
	if (res) {
		await refresh()
		getFotos()
		loadingFotos.value = false
		return useToast().add({
			title: 'Foto Principal atualizada com sucesso!',
			icon: 'i-heroicons-check-badge',
			color: 'green',
		})
	}
}
async function deletarFoto(index: number) {
	loadingFotos.value = true
	const res = await $fetch('/api/delete/foto', {
		method: 'POST',
		body: {
			id: idFotos.value,
			index: index.toString(),
		},
	}).catch((err) => {
		useToast().add({
			title: err.data.message,
			icon: 'i-heroicons-exclamation-triangle',
			color: 'red',
		})
		modalFotos.value = false
	})
	if (res) {
		await refresh()
		getFotos()
		loadingFotos.value = false
		return useToast().add({
			title: 'Foto excluída com sucesso!',
			icon: 'i-heroicons-check-badge',
			color: 'green',
		})
	}
}
</script>

<template>
	<UCard
		class="w-full min-h-[calc(100vh-131px)]"
		:ui="{
			base: '',
			ring: '',
			divide: 'divide-y divide-gray-200 dark:divide-gray-700',
			header: { padding: 'px-4 py-5' },
			rounded: '',
			body: { padding: '', base: 'divide-y divide-gray-200 dark:divide-gray-700' },
			footer: { padding: 'p-4' },
		}"
	>
		<div class="flex items-center justify-between px-4 py-3 gap-3">
			<label for="pesquisar-auditorio" class="hidden">Pesquisar Auditório</label>
			<UInput
				id="pesquisar-auditorio"
				v-model="pesquisar"
				icon="i-heroicons-magnifying-glass-20-solid"
				placeholder="Pesquisar..."
			/>
			<UButton
				color="green"
				label="Adicionar Auditório"
				icon="i-heroicons-squares-plus"
				@click="modalNovo = true"
			/>
		</div>
		<UTable
			v-if="audFiltro"
			:rows="audFiltro"
			:columns="colunas"
			:loading="pending"
			:loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Carregando...' }"
			:empty-state="{
				icon: 'i-heroicons-circle-stack-20-solid',
				label: 'Nenhum auditório encontrado.',
			}"
			sort-asc-icon="i-heroicons-arrow-up"
			sort-desc-icon="i-heroicons-arrow-down"
		>
			<template #id-data="{ row }">
				<UTooltip :text="row._id" :popper="{ placement: 'top' }" class="cursor-context-menu">
					<UIcon name="i-heroicons-eye" />
				</UTooltip>
			</template>
			<template #coordenacao-data="{ row }">
				<UBadge size="xs" :label="row.coordenacao" variant="subtle" />
			</template>
			<template #capacidade-data="{ row }">
				<UBadge size="xs" :label="row.capacidade" color="teal" variant="outline" />
			</template>
			<template #url-data="{ row }">
				<UBadge size="xs" :label="row.url" color="indigo" variant="subtle" />
			</template>
			<template #itens-data="{ row }">
				<UTooltip
					:text="row.itens.join(', ')"
					:popper="{ placement: 'top' }"
					class="cursor-context-menu"
				>
					<UIcon name="i-heroicons-eye" />
				</UTooltip>
			</template>
			<template #descricao-data="{ row }">
				<UTooltip :text="row.descricao" :popper="{ placement: 'top' }" class="cursor-context-menu">
					<UIcon name="i-heroicons-eye" />
				</UTooltip>
			</template>
			<template #acoes-data="{ row }">
				<div class="flex space-x-2">
					<UTooltip text="Ver Auditório" :popper="{ placement: 'top' }">
						<UButton
							icon="i-heroicons-arrow-top-right-on-square"
							size="2xs"
							color="emerald"
							variant="soft"
							:ui="{ rounded: 'rounded-full' }"
							@click="navigateTo(`/auditorio/${row.url}`)"
						/>
					</UTooltip>
					<UTooltip text="Editar Auditório" :popper="{ placement: 'top' }">
						<UButton
							icon="i-heroicons-pencil-square"
							size="2xs"
							variant="soft"
							:ui="{ rounded: 'rounded-full' }"
							@click="abrirEditar(row)"
						/>
					</UTooltip>
					<UTooltip text="Editar Imagens" :popper="{ placement: 'top' }">
						<UButton
							icon="i-heroicons-photo"
							size="2xs"
							color="indigo"
							variant="soft"
							:ui="{ rounded: 'rounded-full' }"
							@click="abrirFotos(row.nome, row._id)"
						/>
					</UTooltip>
					<UTooltip text="Excluir Auditório" :popper="{ placement: 'top' }">
						<UButton
							icon="i-heroicons-trash"
							size="2xs"
							color="red"
							variant="soft"
							:ui="{ rounded: 'rounded-full' }"
							@click="abrirExcluir(row.nome, row._id)"
						/>
					</UTooltip>
				</div>
			</template>
		</UTable>
	</UCard>

	<UModal v-model="modalNovo">
		<UCard
			:ui="{
				divide: 'divide-y divide-gray-100 dark:divide-gray-800',
				header: { background: 'bg-green-500' },
			}"
		>
			<template #header>
				<h3 class="text-center text-white">
					Novo Auditório
				</h3>
			</template>

			<div class="grid grid-cols-2 gap-4 place-items-center">
				<div class="w-full">
					<label
						class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
						for="nome-novo"
					>Nome</label>
					<UInput id="nome-novo" v-model="nomeNovo" />
				</div>
				<div class="w-full">
					<label
						class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
						for="capacidade-novo"
					>Capacidade</label>
					<UInput id="capacidade-novo" v-model="capacidadeNovo" @keydown="useIsNumber" />
				</div>
				<div class="w-full">
					<label
						class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
						for="coordenacao-novo"
					>Coordenação</label>
					<USelectMenu
						id="coordenacao-novo"
						v-model="coordenacaoNovo"
						:options="useCoordenacoes"
						searchable
						searchable-placeholder="Pesquisar..."
					/>
				</div>
				<div class="w-full">
					<label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="url-novo">URL</label>
					<UInput id="url-novo" v-model="urlNovo" @keydown.space.prevent />
				</div>
				<div class="w-full">
					<label
						class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
						for="itens-novo"
					>Itens (separados por vírgulas)</label>
					<UInput id="itens-novo" v-model="itensNovo" />
				</div>
				<div class="w-full">
					<label
						class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
						for="planta-novo"
					>Planta</label>
					<UButton
						id="planta-novo"
						icon="i-heroicons-arrow-up-tray"
						size="sm"
						color="emerald"
						variant="solid"
						:label="plantaNovo && plantaNovo[0] ? 'Selecionado' : 'Selecione'"
						block
						@click="abrirPlantaNovo"
					/>
				</div>
				<div class="w-full col-span-2">
					<label
						class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
						for="descricao-novo"
					>Descrição</label>
					<UTextarea id="descricao-novo" v-model="descricaoNovo" autoresize />
				</div>
			</div>

			<template #footer>
				<div class="flex justify-center space-x-4">
					<UButton
						label="Cancelar"
						color="red"
						icon="i-heroicons-no-symbol"
						:disabled="loadingNovo"
						@click="modalNovo = false"
					/>
					<UButton
						label="Criar"
						color="green"
						icon="i-heroicons-check-circle"
						:loading="loadingNovo"
						@click="criar"
					/>
				</div>
			</template>
		</UCard>
	</UModal>

	<UModal v-model="modalEditar">
		<UCard
			:ui="{
				divide: 'divide-y divide-gray-100 dark:divide-gray-800',
				header: { background: 'bg-blue-500' },
			}"
		>
			<template #header>
				<h3 class="text-center text-white">
					Editar Auditório - {{ nomeFixEditar }}
				</h3>
			</template>

			<div class="grid grid-cols-2 gap-4 place-items-center">
				<div class="w-full">
					<label
						class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
						for="nome-editar"
					>Nome</label>
					<UInput id="nome-editar" v-model="nomeEditar" />
				</div>
				<div class="w-full">
					<label
						class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
						for="capacidade-editar"
					>Capacidade</label>
					<UInput id="capacidade-editar" v-model="capacidadeEditar" @keydown="useIsNumber" />
				</div>
				<div class="w-full">
					<label
						class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
						for="coordenacao-editar"
					>Coordenação</label>
					<USelectMenu
						id="coordenacao-editar"
						v-model="coordenacaoEditar"
						:options="useCoordenacoes"
						searchable
						searchable-placeholder="Pesquisar..."
					/>
				</div>
				<div class="w-full">
					<label
						class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
						for="url-editar"
					>URL</label>
					<UInput id="url-editar" v-model="urlEditar" @keydown.space.prevent />
				</div>
				<div class="w-full">
					<label
						class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
						for="itens-editar"
					>Itens (separados por vírgulas)</label>
					<UInput id="itens-editar" v-model="itensEditar" />
				</div>
				<div class="w-full">
					<label
						class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
						for="planta-editar"
					>Planta</label>
					<UButton
						id="planta-editar"
						icon="i-heroicons-arrow-up-tray"
						size="sm"
						color="emerald"
						variant="solid"
						:label="plantaEditar && plantaEditar[0] ? 'Selecionado' : 'Selecione'"
						block
						@click="abrirPlantaEditar"
					/>
				</div>
				<div class="w-full col-span-2">
					<label
						class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
						for="descricao-editar"
					>Descrição</label>
					<UTextarea id="descricao-editar" v-model="descricaoEditar" autoresize />
				</div>
			</div>

			<template #footer>
				<div class="flex justify-center space-x-4">
					<UButton
						label="Cancelar"
						color="red"
						icon="i-heroicons-no-symbol"
						:disabled="loadingEditar"
						@click="modalEditar = false"
					/>
					<UButton
						label="Editar"
						icon="i-heroicons-pencil-square"
						:loading="loadingEditar"
						@click="editar"
					/>
				</div>
			</template>
		</UCard>
	</UModal>

	<UModal v-model="modalFotos" :ui="{ width: '!w-4/5 sm:max-w-full' }">
		<UCard
			:ui="{
				divide: 'divide-y divide-gray-100 dark:divide-gray-800',
				header: { background: 'bg-cyan-500' },
			}"
		>
			<template #header>
				<h3 class="text-center text-white">
					Fotos Auditório - {{ nomeFotos }}
				</h3>
			</template>
			<div v-if="fotos.length > 0" class="grid grid-cols-5 gap-4">
				<div v-for="(foto, i) in fotos" :key="foto" class="relative inline-block">
					<NuxtImg
						class="rounded-md"
						:src="`${SITE_URL}/foto?f=${foto}`"
						alt="'Fotos do auditório selecionado"
						loading="lazy"
					/>
					<UButton
						class="absolute left-[10px] bottom-[10px]"
						icon="i-heroicons-star"
						size="2xs"
						color="emerald"
						variant="soft"
						:disabled="i === 0"
						:ui="{ rounded: 'rounded-full' }"
						@click="principal(i)"
					/>
					<UButton
						class="absolute right-[10px] bottom-[10px]"
						icon="i-heroicons-trash"
						size="2xs"
						color="red"
						variant="soft"
						:ui="{ rounded: 'rounded-full' }"
						@click="deletarFoto(i)"
					/>
				</div>
			</div>
			<span v-else class="block text-sm font-medium text-center text-gray-900 dark:text-white">nenhuma foto encontrada</span>
			<template #footer>
				<div class="flex justify-center space-x-4">
					<UButton
						label="Fechar"
						color="cyan"
						icon="i-heroicons-x-circle"
						:disabled="loadingFotos"
						@click="modalFotos = false"
					/>
					<UButton
						label="Enviar"
						color="green"
						icon="i-heroicons-arrow-up-tray"
						:loading="loadingFotos"
						@click="abrirFileFotos"
					/>
				</div>
			</template>
		</UCard>
	</UModal>

	<UModal v-model="modalExcluir">
		<UCard
			:ui="{
				divide: 'divide-y divide-gray-100 dark:divide-gray-800',
				header: { background: 'bg-red-500' },
			}"
		>
			<template #header>
				<h3 class="text-center text-white">
					Excluir Auditório - {{ nomeExcluir }}
				</h3>
			</template>
			<span class="block text-sm font-medium text-center text-gray-900 dark:text-white">Tem certeza que deseja excluir este auditório?</span>
			<template #footer>
				<div class="flex justify-center space-x-4">
					<UButton
						label="Cancelar"
						color="green"
						icon="i-heroicons-x-circle"
						:disabled="loadingExcluir"
						@click="modalExcluir = false"
					/>
					<UButton
						label="Excluir"
						color="red"
						icon="i-heroicons-trash"
						:disabled="loadingExcluir"
						@click="excluir"
					/>
				</div>
			</template>
		</UCard>
	</UModal>
</template>
