<script setup lang="ts">
const { data: internos, error, pending: pendingInternos } = await useFetch('/api/fetch/internos')
if (error.value) {
	const err = (error.value as any).data
	if (err) {
		const { statusCode, statusMessage, message } = err
		throw createError({ statusCode, statusMessage, message })
	}
}
const { data: externos, error: error2, refresh, pending: pendingExternos } = await useFetch('/api/fetch/externos')
if (error2.value) {
	const err = (error2.value as any).data
	if (err) {
		const { statusCode, statusMessage, message } = err
		throw createError({ statusCode, statusMessage, message })
	}
}
const { data: instituicoes, error: error3 } = await useFetch('/api/fetch/instituicoes')
if (error3.value) {
	const err = (error3.value as any).data
	if (err) {
		const { statusCode, statusMessage, message } = err
		throw createError({ statusCode, statusMessage, message })
	}
}

const colunasInterno = [
	{
		key: 'idcbpf',
		label: 'ID CBPF',
		sortable: false,
	},
	{
		key: 'nivel',
		label: 'Nível',
		sortable: true,
	},
	{
		key: 'coordenacao',
		label: 'Coordenação',
		sortable: true,
	},
]
const pesquisarInterno = ref('')
const internoFiltro = computed(() => {
	if (pesquisarInterno.value && internos.value) {
		return internos.value.filter((item) => {
			return Object.values(item).some((value) => {
				return String(value).toLowerCase().includes(pesquisarInterno.value.toLowerCase())
			})
		})
	}
	return internos.value
})

const colunasExterno = [
	{
		key: 'email',
		label: 'Email',
		sortable: false,
	},
	{
		key: 'nivel',
		label: 'Nível',
		sortable: true,
	},
	{
		key: 'instituicao',
		label: 'Instituição',
		sortable: true,
	},
	{
		key: 'acoes',
		label: 'Ações',
	},
]
const pesquisarExterno = ref('')
const externoFiltro = computed(() => {
	if (pesquisarExterno.value && externos.value) {
		return externos.value.filter((item) => {
			return Object.values(item).some((value) => {
				return String(value).toLowerCase().includes(pesquisarExterno.value.toLowerCase())
			})
		})
	}
	return externos.value
})

const modalNovo = ref(false)
const loadingNovo = ref(false)
const emailNovo = ref('')
const instituicaoNovo = ref('')
const senhaNovo = ref('')
watch(modalNovo, (nv) => {
	if (!nv) {
		setTimeout(() => {
			emailNovo.value = ''
			instituicaoNovo.value = ''
			senhaNovo.value = ''
			loadingNovo.value = false
		}, 300)
	}
})
async function criar() {
	loadingNovo.value = true
	if (!emailNovo.value) {
		useToast().add({
			title: 'Preencha o Email do Usuário',
			icon: 'i-heroicons-exclamation-circle',
			color: 'amber',
		})
		return (loadingNovo.value = false)
	}
	if (!useValidateEmail(emailNovo.value)) {
		useToast().add({
			title: 'Preencha um Email Válido',
			icon: 'i-heroicons-exclamation-circle',
			color: 'amber',
		})
		return (loadingNovo.value = false)
	}
	if (!instituicaoNovo.value) {
		useToast().add({
			title: 'Preencha a Instituição do Usuário',
			icon: 'i-heroicons-exclamation-circle',
			color: 'amber',
		})
		return (loadingNovo.value = false)
	}
	if (!senhaNovo.value) {
		useToast().add({
			title: 'Preencha a Senha do Usuário',
			icon: 'i-heroicons-exclamation-circle',
			color: 'amber',
		})
		return (loadingNovo.value = false)
	}
	if (!useValidatePasswd(senhaNovo.value)) {
		useToast().add({
			title:
				'Senha deve conter 8 digitos, 1 letra maiúscula, 1 letra minúscula, 1 número e um caractere especial',
			icon: 'i-heroicons-exclamation-circle',
			color: 'amber',
		})
		return (loadingNovo.value = false)
	}
	const res = await $fetch('/api/insert/externo', {
		method: 'POST',
		body: {
			email: emailNovo.value.toLowerCase(),
			instituicao: instituicaoNovo.value,
			senha: senhaNovo.value,
		},
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
			title: 'Usuário externo criado com sucesso!',
			icon: 'i-heroicons-check-badge',
			color: 'green',
		})
	}
}

const modalEditar = ref(false)
const loadingEditar = ref(false)
const emailFixEditar = ref('')
const idEditar = ref('')
const emailEditar = ref('')
const instituicaoEditar = ref('')
const senhaEditar = ref('')
function abrirEditar(externo: UsuarioExterno) {
	emailFixEditar.value = externo.email
	if (externo._id)
		idEditar.value = externo._id
	emailEditar.value = externo.email
	instituicaoEditar.value = externo.instituicao
	modalEditar.value = true
}
watch(modalEditar, (nv) => {
	if (!nv) {
		setTimeout(() => {
			emailFixEditar.value = ''
			idEditar.value = ''
			emailEditar.value = ''
			instituicaoEditar.value = ''
			senhaEditar.value = ''
			loadingEditar.value = false
		}, 300)
	}
})
async function editar() {
	loadingEditar.value = true
	if (!instituicaoEditar.value) {
		useToast().add({
			title: 'Preencha a Instituição do Usuário',
			icon: 'i-heroicons-exclamation-circle',
			color: 'amber',
		})
		return (loadingEditar.value = false)
	}
	if (senhaEditar.value && !useValidatePasswd(senhaEditar.value)) {
		useToast().add({
			title:
				'Senha deve conter 8 digitos, 1 letra maiúscula, 1 letra minúscula, 1 número e um caractere especial',
			icon: 'i-heroicons-exclamation-circle',
			color: 'amber',
		})
		return (loadingEditar.value = false)
	}
	const res = await $fetch('/api/update/externo', {
		method: 'POST',
		body: {
			id: idEditar.value,
			instituicao: instituicaoEditar.value,
			senha: senhaEditar.value,
		},
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
			title: 'Usuário externo editado com sucesso!',
			icon: 'i-heroicons-check-badge',
			color: 'green',
		})
	}
}

const modalExcluir = ref(false)
const loadingExcluir = ref(false)
const idExcluir = ref('')
const emailExcluir = ref('')
watch(modalExcluir, (nv) => {
	if (!nv) {
		setTimeout(() => {
			idExcluir.value = ''
			emailExcluir.value = ''
			loadingExcluir.value = false
		}, 300)
	}
})
function abrirExcluir(externo: UsuarioExterno) {
	if (externo._id)
		idExcluir.value = externo._id
	emailExcluir.value = externo.email
	modalExcluir.value = true
}
async function excluir() {
	loadingExcluir.value = true
	const res = await $fetch('/api/delete/externo', {
		method: 'POST',
		body: {
			id: idExcluir.value,
			email: emailExcluir.value,
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
			title: 'Usuário externo excluído com sucesso!',
			icon: 'i-heroicons-check-badge',
			color: 'green',
		})
	}
}
</script>

<template>
	<UCard
		class="w-full"
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
		<template #header>
			<h2 class="text-xl font-semibold leading-tight text-center text-gray-900 dark:text-white">
				Usuários Internos
			</h2>
		</template>
		<div class="flex items-center justify-between px-4 py-3 gap-3">
			<label for="pesquisar-interno" class="hidden">Pesquisar Usuário Interno</label>
			<UInput
				id="pesquisar-interno"
				v-model="pesquisarInterno"
				icon="i-heroicons-magnifying-glass-20-solid"
				placeholder="Pesquisar..."
			/>
			<UButton
				color="green"
				label="Adicionar/Editar Usuários Internos"
				icon="i-heroicons-user-plus"
				@click="navigateTo('https://id.cbpf.br', { external: true, open: { target: '_blank' } })"
			/>
		</div>
		<UTable
			v-if="internoFiltro"
			:rows="internoFiltro"
			:columns="colunasInterno"
			:loading="pendingInternos"
			:loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Carregando...' }"
			:empty-state="{
				icon: 'i-heroicons-circle-stack-20-solid',
				label: 'Nenhum usuário interno encontrado.',
			}"
			sort-asc-icon="i-heroicons-arrow-up"
			sort-desc-icon="i-heroicons-arrow-down"
		>
			<template #nivel-data="{ row }">
				<UTooltip
					v-if="row.nivel === 'Administrador'"
					text="Permissão total na ferramenta"
					:popper="{ placement: 'top' }"
				>
					<UBadge size="xs" :label="row.nivel" color="red" variant="subtle" />
				</UTooltip>
				<UTooltip
					v-else-if="row.nivel === 'Gerente'"
					text="Pode ver, aceitar e solicitar reservas"
					:popper="{ placement: 'top' }"
				>
					<UBadge size="xs" :label="row.nivel" color="lime" variant="subtle" />
				</UTooltip>
				<UTooltip
					v-else-if="row.nivel === 'Secretária'"
					text="Pode ver e solicitar reservas"
					:popper="{ placement: 'top' }"
				>
					<UBadge size="xs" :label="row.nivel" color="indigo" variant="subtle" />
				</UTooltip>
				<UTooltip
					v-else-if="row.nivel === 'Técnico'"
					text="Pode ver reservas"
					:popper="{ placement: 'top' }"
				>
					<UBadge size="xs" :label="row.nivel" color="cyan" variant="subtle" />
				</UTooltip>
				<span v-else>-</span>
			</template>
			<template #coordenacao-data="{ row }">
				<UBadge
					v-if="row.coordenacao.length > 0"
					color="teal"
					variant="outline"
					:label="row.coordenacao.join(' - ')"
				/>
				<span v-else>-</span>
			</template>
		</UTable>
	</UCard>
	<UCard
		class="w-full"
		:ui="{
			base: '',
			ring: '',
			divide: 'divide-y divide-gray-200 dark:divide-gray-700',
			header: { padding: 'px-4 py-5' },
			body: { padding: '', base: 'divide-y divide-gray-200 dark:divide-gray-700' },
			footer: { padding: 'p-4' },
		}"
	>
		<template #header>
			<h2 class="text-xl font-semibold leading-tight text-center text-gray-900 dark:text-white">
				Usuários Externos
			</h2>
		</template>
		<div class="flex items-center justify-between px-4 py-3 gap-3">
			<label for="pesquisar-externo" class="hidden">Pesquisar Usuário Externo</label>
			<UInput
				id="pesquisar-externo"
				v-model="pesquisarExterno"
				icon="i-heroicons-magnifying-glass-20-solid"
				placeholder="Pesquisar..."
			/>
			<UButton
				color="green"
				label="Adicionar Usuário Externo"
				icon="i-heroicons-user-plus"
				@click="modalNovo = true"
			/>
		</div>
		<UTable
			v-if="externoFiltro"
			:rows="externoFiltro"
			:columns="colunasExterno"
			:loading="pendingExternos"
			:loading-state="{ icon: 'i-heroicons-arrow-path-20-solid', label: 'Carregando...' }"
			:empty-state="{
				icon: 'i-heroicons-circle-stack-20-solid',
				label: 'Nenhum usuário externo encontrado.',
			}"
			sort-asc-icon="i-heroicons-arrow-up"
			sort-desc-icon="i-heroicons-arrow-down"
		>
			<template #nivel-data>
				<UTooltip text="Pode solicitar reservas" :popper="{ placement: 'top' }">
					<UBadge size="xs" label="Externo" variant="subtle" />
				</UTooltip>
			</template>
			<template #acoes-data="{ row }">
				<div class="flex space-x-2">
					<UTooltip text="Editar Usuário Externo" :popper="{ placement: 'top' }">
						<UButton
							icon="i-heroicons-pencil-square"
							size="2xs"
							variant="soft"
							:ui="{ rounded: 'rounded-full' }"
							@click="abrirEditar(row)"
						/>
					</UTooltip>
					<UTooltip text="Excluir Usuário Externo" :popper="{ placement: 'top' }">
						<UButton
							icon="i-heroicons-trash"
							size="2xs"
							color="red"
							variant="soft"
							:ui="{ rounded: 'rounded-full' }"
							@click="abrirExcluir(row)"
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
					Novo Usuário Externo
				</h3>
			</template>

			<div class="grid grid-cols-1 gap-4 place-items-center">
				<div class="w-full">
					<label
						class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
						for="email-novo"
					>Email</label>
					<UInput id="email-novo" v-model="emailNovo" icon="i-heroicons-envelope" />
				</div>
				<div class="w-full">
					<label
						class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
						for="instituicao-novo"
					>Instituição</label>
					<USelectMenu
						v-if="instituicoes"
						id="instituicao-novo"
						v-model="instituicaoNovo"
						icon="i-heroicons-user-group"
						:options="instituicoes"
						value-attribute="nome"
						option-attribute="nome"
						searchable
						searchable-placeholder="Pesquisar..."
					/>
				</div>
				<div class="w-full">
					<label
						class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
						for="senha-novo"
					>Senha</label>
					<UInput id="senha-novo" v-model="senhaNovo" type="password" icon="i-heroicons-key" />
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
					Editar Usuário Externo - {{ emailFixEditar }}
				</h3>
			</template>
			<div class="grid grid-cols-1 gap-4 place-items-center">
				<div class="w-full">
					<label
						class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
						for="email-novo"
					>Email</label>
					<UInput id="email-novo" v-model="emailEditar" icon="i-heroicons-envelope" disabled />
				</div>
				<div class="w-full">
					<label
						class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
						for="instituicao-novo"
					>Instituição</label>
					<USelectMenu
						v-if="instituicoes"
						id="instituicao-novo"
						v-model="instituicaoEditar"
						icon="i-heroicons-user-group"
						:options="instituicoes"
						value-attribute="nome"
						option-attribute="nome"
						searchable
						searchable-placeholder="Pesquisar..."
					/>
				</div>
				<div class="w-full">
					<label
						class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
						for="senha-novo"
					>Senha</label>
					<UInput id="senha-novo" v-model="senhaEditar" type="password" icon="i-heroicons-key" />
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
					Excluir Usuário Externo - {{ emailExcluir }}
				</h3>
			</template>
			<span class="block text-sm font-medium text-center text-gray-900 dark:text-white">Tem certeza que deseja excluir este usuário?</span>
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
