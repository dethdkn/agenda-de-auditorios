<script setup lang="ts">
const { data, error, refresh, pending } = await useFetch('/api/fetch/emails')
if (error.value) {
	const err = (error.value as any).data
	if (err) {
		const { statusCode, statusMessage, message } = err
		throw createError({ statusCode, statusMessage, message })
	}
}

const { data: auditorios, error: error2 } = await useFetch('/api/fetch/auditorios')
if (error2.value) {
	const err = (error2.value as any).data
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
		key: 'email',
		label: 'Email',
		sortable: true,
	},
	{
		key: 'auditorios',
		label: 'Auditorios',
		sortable: true,
	},
	{
		key: 'acoes',
		label: 'Ações',
		sortable: false,
	},
]

const pesquisar = ref('')
const emailFiltro = computed(() => {
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
const emailNovo = ref('')
const auditoriosNovo = ref<string[]>([])

watch(modalNovo, (nv) => {
	if (!nv) {
		setTimeout(() => {
			emailNovo.value = ''
			auditoriosNovo.value = []
			loadingNovo.value = false
		}, 300)
	}
})

async function cadastrar() {
	loadingNovo.value = true
	if (!emailNovo.value) {
		useToast().add({
			title: 'Preencha o Email',
			icon: 'i-heroicons-exclamation-circle',
			color: 'amber',
		})
		return (loadingNovo.value = false)
	}
	if (!useValidateEmail(emailNovo.value)) {
		useToast().add({
			title: 'Preencha um Email válido',
			icon: 'i-heroicons-exclamation-circle',
			color: 'amber',
		})
		return (loadingNovo.value = false)
	}
	if (auditoriosNovo.value.length < 1) {
		useToast().add({
			title: 'Selecione pelo menos 1 Auditório',
			icon: 'i-heroicons-exclamation-circle',
			color: 'amber',
		})
		return (loadingNovo.value = false)
	}
	const res = await $fetch('/api/insert/email', {
		method: 'POST',
		body: { email: emailNovo.value, auditorios: auditoriosNovo.value },
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
		useToast().add({
			title: 'Email cadastrado com sucesso!',
			icon: 'i-heroicons-check-badge',
			color: 'green',
		})
		return modalNovo.value = false
	}
}

const modalEditar = ref(false)
const loadingEditar = ref(false)
const emailEditar = ref('')
const auditoriosEditar = ref<string[]>([])

watch(modalEditar, (nv) => {
	if (!nv) {
		setTimeout(() => {
			emailEditar.value = ''
			auditoriosEditar.value = []
			loadingEditar.value = false
		}, 300)
	}
})

function abrirEditar(email: string, auditorios: string[]) {
	emailEditar.value = email
	auditoriosEditar.value = auditorios
	modalEditar.value = true
}

async function editar() {
	loadingEditar.value = true
	if (auditoriosEditar.value.length < 1) {
		useToast().add({
			title: 'Selecione pelo menos 1 Auditório',
			icon: 'i-heroicons-exclamation-circle',
			color: 'amber',
		})
		return (loadingEditar.value = false)
	}
	const res = await $fetch('/api/update/email', {
		method: 'POST',
		body: { email: emailEditar.value, auditorios: auditoriosEditar.value },
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
		useToast().add({
			title: 'Email editado com sucesso!',
			icon: 'i-heroicons-check-badge',
			color: 'green',
		})
		return modalEditar.value = false
	}
}

const modalExcluir = ref(false)
const loadingExcluir = ref(false)
const idExcluir = ref('')

watch(modalExcluir, (nv) => {
	if (!nv) {
		setTimeout(() => {
			idExcluir.value = ''
			loadingExcluir.value = false
		}, 300)
	}
})

function abrirExcluir(id: string) {
	idExcluir.value = id
	modalExcluir.value = true
}

async function excluir() {
	loadingExcluir.value = true
	const res = await $fetch('/api/delete/email', {
		method: 'POST',
		body: { id: idExcluir.value },
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
		useToast().add({
			title: 'Email excluido com sucesso!',
			icon: 'i-heroicons-check-badge',
			color: 'green',
		})
		return modalExcluir.value = false
	}
}

const modalDuvida = ref(false)
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
			<label for="pesquisar-email" class="hidden">Pesquisar Emails</label>
			<UInput
				id="pesquisar-email"
				v-model="pesquisar"
				icon="i-heroicons-magnifying-glass-20-solid"
				placeholder="Pesquisar..."
			/>
			<UButton
				icon="i-heroicons-chat-bubble-oval-left-ellipsis"
				color="cyan"
				variant="ghost"
				:ui="{ rounded: 'rounded-full' }"
				@click="modalDuvida = true"
			/>
			<UButton
				color="green"
				label="Cadastar Email"
				icon="i-heroicons-envelope"
				@click="modalNovo = true"
			/>
		</div>
		<UTable
			v-if="emailFiltro"
			:rows="emailFiltro"
			:columns="colunas"
			:loading="pending"
			:loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Carregando...' }"
			:empty-state="{
				icon: 'i-heroicons-circle-stack-20-solid',
				label: 'Nenhum email encontrado.',
			}"
			sort-asc-icon="i-heroicons-arrow-up"
			sort-desc-icon="i-heroicons-arrow-down"
		>
			<template #id-data="{ row }">
				<UTooltip :text="row._id" :popper="{ placement: 'top' }" class="cursor-context-menu">
					<UIcon name="i-heroicons-eye" />
				</UTooltip>
			</template>
			<template #email-data="{ row }">
				<UBadge size="xs" :label="row.email" variant="subtle" />
			</template>
			<template #auditorios-data="{ row }">
				<span class="block truncate max-w-[1000px]">{{ row.auditorios.join(', ') }}</span>
			</template>
			<template #acoes-data="{ row }">
				<div class="flex space-x-2">
					<UTooltip text="Editar Email" :popper="{ placement: 'top' }">
						<UButton
							icon="i-heroicons-pencil-square"
							size="2xs"
							variant="soft"
							:ui="{ rounded: 'rounded-full' }"
							@click="abrirEditar(row.email, row.auditorios)"
						/>
					</UTooltip>
					<UTooltip text="Excluir Email" :popper="{ placement: 'top' }">
						<UButton
							icon="i-heroicons-trash"
							size="2xs"
							color="red"
							variant="soft"
							:ui="{ rounded: 'rounded-full' }"
							@click="abrirExcluir(row._id)"
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
					Cadastrar Email
				</h3>
			</template>

			<div class="grid grid-cols-1 gap-4 place-items-center">
				<div class="w-full">
					<label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="email-novo">Email</label>
					<UInput id="email-novo" v-model="emailNovo" type="email" />
				</div>
				<span class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Receber dos seguintes auditórios</span>
				<div v-if="auditorios" class="grid grid-cols-2 gap-4">
					<UCheckbox v-for="auditorio in auditorios" :key="auditorio.nome" v-model="auditoriosNovo" name="auditoriosNovo" :label="auditorio.nome" :value="auditorio.nome" />
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
						label="Cadastrar"
						color="green"
						icon="i-heroicons-check-circle"
						:loading="loadingNovo"
						@click="cadastrar"
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
					Editar Email - {{ emailEditar }}
				</h3>
			</template>

			<div class="grid grid-cols-1 gap-4 place-items-center">
				<div class="w-full">
					<label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="email-editar">Email</label>
					<UInput id="email-editar" v-model="emailEditar" type="email" disabled />
				</div>
				<span class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Receber dos seguintes auditórios</span>
				<div v-if="auditorios" class="grid grid-cols-2 gap-4">
					<UCheckbox v-for="auditorio in auditorios" :key="auditorio.nome" v-model="auditoriosEditar" name="auditoriosNovo" :label="auditorio.nome" :value="auditorio.nome" />
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

	<UModal v-model="modalExcluir">
		<UCard
			:ui="{
				divide: 'divide-y divide-gray-100 dark:divide-gray-800',
				header: { background: 'bg-red-500' },
			}"
		>
			<template #header>
				<h3 class="text-center text-white">
					Excluir Email
				</h3>
			</template>
			<span class="block text-sm font-medium text-center text-gray-900 dark:text-white">Tem certeza que deseja excluir este email?</span>
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

	<UModal v-model="modalDuvida">
		<UCard
			:ui="{
				divide: 'divide-y divide-gray-100 dark:divide-gray-800',
				header: { background: 'bg-cyan-500' },
			}"
		>
			<template #header>
				<h3 class="text-center text-white">
					Quem recebe os Emails da Agenda de Auditórios?
				</h3>
			</template>
			<div class="space-y-4">
				<p class="block text-sm font-medium text-center text-gray-900 dark:text-white">
					Por padrão, os Administradores recebem todos os emails enviados da Agenda de auditórios.
				</p>
				<p class="block text-sm font-medium text-center text-gray-900 dark:text-white">
					Os gerentes tambem recebem todos, porem, somente dos auditorios que pertecem a sua coordenação ou de reservas que solicitaram.
				</p>
				<p class="block text-sm font-medium text-center text-gray-900 dark:text-white">
					Os Técnicos recebem de todos os auditórios, porem, apenas reservas aprovadas ou canceladas.
				</p>
				<p class="block text-sm font-medium text-center text-gray-900 dark:text-white">
					As secretárias receberam todos os emails de reservas que foram solicitadas por elas.
				</p>
				<p class="block text-sm font-medium text-center text-gray-900 dark:text-white">
					Já os emails cadastradas nesta lista, vão receber todos os emails dos auditórios selecionados, porem, apenas de reservas já aprovadas ou canceladas.
				</p>
			</div>
			<template #footer>
				<div class="flex justify-center space-x-4">
					<UButton
						label="Ok!"
						color="green"
						icon="i-heroicons-arrow-uturn-left"
						:disabled="loadingExcluir"
						@click="modalDuvida = false"
					/>
				</div>
			</template>
		</UCard>
	</UModal>
</template>
