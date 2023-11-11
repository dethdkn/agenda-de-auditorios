<script setup lang="ts">
import type { AccordionItem } from '@nuxt/ui/dist/runtime/types'

const filtro = ref('Auditório')
const auditorioSelecionado = ref('Selecione')
const coordenacaoSelecionada = ref('Selecione')
const statusSelecionado = ref('Selecione')
const dataSelecionada = ref()
const {
	data: reservas,
	error,
	refresh,
} = await useFetch('/api/fetch/reservas', {
	method: 'post',
	body: {
		auditorio: auditorioSelecionado,
		coordenacao: coordenacaoSelecionada,
		status: statusSelecionado,
		data: dataSelecionada,
	},
})
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
const auditoriosNomes = computed(() => {
	const nomes: string[] = ['Selecione']
	if (auditorios.value)
		for (const aud of auditorios.value) nomes.push(aud.nome)
	return nomes
})

function limparFiltros() {
	auditorioSelecionado.value = 'Selecione'
	coordenacaoSelecionada.value = 'Selecione'
	statusSelecionado.value = 'Selecione'
	dataSelecionada.value = undefined
}

const reservaLista = computed(() => {
	const items: {
		_id?: string
		nomeEvento: string
		tipoEvento: string
		audNome: string
		audCoord: string
		instResponsavel: string
		nomeResponsavel: string
		emailResponsavel: string
		telefoneResponsavel: string
		recursosAud: string[]
		descricao?: string
		observacao?: string
		solicitadoPor: string
		aceitoPor?: string
		status: string
		datas: string
		datashoras: string[]
		datasArr: Date[]
		icon: string
		color: string
		disabled: false
	}[] = []
	if (reservas.value) {
		for (const reserva of reservas.value) {
			const datasArr: Date[] = []
			const datasString: string[] = []
			const datasHorasString: string[] = []
			for (const data of reserva.datas) {
				datasArr.push(new Date(data.data))
				datasString.push(new Date(data.data).toLocaleDateString('pt-br'))
				datasHorasString.push(
					`${new Date(data.data).toLocaleDateString('pt-br')} das ${data.inicio} às ${data.fim}`,
				)
			}
			items.push({
				_id: reserva._id,
				nomeEvento: reserva.nomeEvento,
				tipoEvento: reserva.tipoEvento,
				audNome: reserva.audNome,
				audCoord: reserva.audCoord,
				instResponsavel: reserva.instResponsavel,
				nomeResponsavel: reserva.nomeResponsavel,
				emailResponsavel: reserva.emailResponsavel,
				telefoneResponsavel: reserva.telefoneResponsavel,
				recursosAud: reserva.recursosAud,
				descricao: reserva.descricao,
				observacao: reserva.observacao,
				solicitadoPor: reserva.solicitadoPor,
				aceitoPor: reserva.aceitoPor,
				status: reserva.status,
				datashoras: datasHorasString,
				datasArr,
				datas: datasString.join(' | '),
				icon:
					reserva.status === 'Aprovado' ? 'i-heroicons-check' : reserva.status === 'Aguardando' ? 'i-heroicons-inbox' : 'i-heroicons-x-mark',
				color:
					reserva.status === 'Aprovado' ? 'green' : reserva.status === 'Aguardando' ? 'blue' : 'red',
				disabled: false,
			})
		}
	}
	return items
})
const page = ref(1)
const pageCount = ref(15)
const reservaListaPag = computed(() => {
	if (reservaLista.value) {
		return reservaLista.value.slice(
			(page.value - 1) * pageCount.value,
			page.value * pageCount.value,
		)
	}
	return reservaLista.value
})

const modalRecusar = ref(false)
const loadingRecusar = ref(false)
const idRecusar = ref('')
function abrirRecusar(id?: string) {
	if (id)
		idRecusar.value = id
	modalRecusar.value = true
}
watch(modalRecusar, (nv) => {
	if (!nv) {
		idRecusar.value = ''
		loadingRecusar.value = false
	}
})
async function recusar() {
	loadingRecusar.value = true
	const res = await $fetch('/api/update/recusar', {
		method: 'POST',
		body: JSON.stringify({
			id: idRecusar.value,
		}),
	}).catch((err) => {
		useToast().add({
			title: err.data.message,
			icon: 'i-heroicons-exclamation-triangle',
			color: 'red',
		})
		modalRecusar.value = false
	})
	if (res) {
		refresh()
		modalRecusar.value = false
		return useToast().add({
			title: 'Reserva recusada com sucesso!',
			icon: 'i-heroicons-check-badge',
			color: 'green',
		})
	}
}

const modalAprovar = ref(false)
const loadingAprovar = ref(false)
const idAprovar = ref('')
function abrirAprovar(id?: string) {
	if (id)
		idAprovar.value = id
	modalAprovar.value = true
}
watch(modalAprovar, (nv) => {
	if (!nv) {
		idAprovar.value = ''
		loadingAprovar.value = false
	}
})
async function aprovar() {
	loadingAprovar.value = true
	const res = await $fetch('/api/update/aprovar', {
		method: 'POST',
		body: {
			id: idAprovar.value,
		},
	}).catch((err) => {
		useToast().add({
			title: err.data.message,
			icon: 'i-heroicons-exclamation-triangle',
			color: 'red',
		})
		modalAprovar.value = false
	})
	if (res) {
		refresh()
		modalAprovar.value = false
		return useToast().add({
			title: 'Reserva aprovada com sucesso!',
			icon: 'i-heroicons-check-badge',
			color: 'green',
		})
	}
}

const modalCancelar = ref(false)
const loadingCancelar = ref(false)
const idCancelar = ref('')
function abrirCancelar(id?: string) {
	if (id)
		idCancelar.value = id
	modalCancelar.value = true
}
watch(modalCancelar, (nv) => {
	if (!nv)
		idCancelar.value = ''
})
async function cancelar() {
	loadingCancelar.value = true
	const res = await $fetch('/api/update/cancelar', {
		method: 'POST',
		body: {
			id: idCancelar.value,
		},
	}).catch((err) => {
		useToast().add({
			title: err.data.message,
			icon: 'i-heroicons-exclamation-triangle',
			color: 'red',
		})
		modalCancelar.value = false
		loadingCancelar.value = false
	})
	if (res) {
		refresh()
		modalCancelar.value = false
		loadingCancelar.value = false
		return useToast().add({
			title: 'Reserva cancelada com sucesso!',
			icon: 'i-heroicons-check-badge',
			color: 'green',
		})
	}
}
</script>

<template>
	<UCard
		class="w-full min-h-[calc(100vh-131px)] pt-4"
		:ui="{
			base: '',
			ring: '',
			divide: '',
			header: { padding: 'px-4 py-3' },
			rounded: '',
			body: { padding: '', base: 'divide-y divide-gray-200 dark:divide-gray-700' },
			footer: { padding: 'p-4' },
		}"
	>
		<template #header>
			<div class="flex items-center justify-start">
				<div class="[&>*]:inline-block">
					<span>Filtrar Reserva Por</span>
					<USelectMenu
						v-model="filtro"
						class="!w-52 ms-4"
						:options="['Auditório', 'Coordenação', 'Status', 'Data']"
						searchable
						searchable-placeholder="Pesquisar..."
						@change="limparFiltros"
					/>
				</div>
				<div>
					<USelectMenu
						v-if="filtro === 'Auditório'"
						v-model="auditorioSelecionado"
						class="!w-52 ms-4"
						:options="auditoriosNomes"
						searchable
						searchable-placeholder="Pesquisar..."
					/>
					<USelectMenu
						v-if="filtro === 'Coordenação'"
						v-model="coordenacaoSelecionada"
						class="!w-52 ms-4"
						:options="['Selecione', ...useCoordenacoes]"
						searchable
						searchable-placeholder="Pesquisar..."
					/>
					<USelectMenu
						v-if="filtro === 'Status'"
						v-model="statusSelecionado"
						class="!w-52 ms-4"
						:options="['Selecione', 'Aprovado', 'Recusado', 'Cancelado', 'Aguardando']"
						searchable
						searchable-placeholder="Pesquisar..."
					/>
					<VDatePicker v-if="filtro === 'Data'" v-model="dataSelecionada" class="ms-4" />
				</div>
			</div>
		</template>
		<UAccordion :items="reservaListaPag as AccordionItem[]">
			<template #default="{ item, open }">
				<UButton
					variant="ghost"
					class="border-b border-gray-200 dark:border-gray-700"
					:ui="{ rounded: 'rounded-none', padding: { sm: 'p-3' } }"
				>
					<template #leading>
						<div
							class="flex items-center justify-center w-6 h-6 -my-1 rounded-full"
							:class="`bg-${item.color}-500`"
						>
							<UIcon :name="item.icon" class="w-5 h-5 text-white dark:text-gray-900" />
						</div>
					</template>
					<span class="truncate">
						<span :class="`text-${item.color}-500`">
							{{ item.nomeEvento }}
						</span>
						<span class="text-gray-900 dark:text-white">
							- {{ item.audNome }}, {{ item.audCoord }} | {{ item.datas }}
						</span>
					</span>
					<template #trailing>
						<UIcon
							name="i-heroicons-chevron-right-20-solid"
							class="w-5 h-5 transition-transform duration-200 transform ms-auto"
							:class="[open && 'rotate-90']"
						/>
					</template>
				</UButton>
			</template>
			<template #item="{ item }">
				<UContainer>
					<div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10 text-center place-items-center">
						<div>
							<p class="text-xl font-extrabold text-black dark:text-white">
								Nome do Evento
							</p>
							<p>{{ item.nomeEvento }}</p>
						</div>
						<div>
							<p class="text-xl font-extrabold text-black dark:text-white">
								Tipo do Evento
							</p>
							<p>{{ item.tipoEvento }}</p>
						</div>
						<div>
							<p class="text-xl font-extrabold text-black dark:text-white">
								Instituição Responsável
							</p>
							<p>{{ item.instResponsavel }}</p>
						</div>
						<div>
							<p class="text-xl font-extrabold text-black dark:text-white">
								Nome do Responsável
							</p>
							<p>{{ item.nomeResponsavel }}</p>
						</div>
						<div>
							<p class="text-xl font-extrabold text-black dark:text-white">
								E-mail do Responsável
							</p>
							<p>{{ item.emailResponsavel }}</p>
						</div>
						<div>
							<p class="text-xl font-extrabold text-black dark:text-white">
								Telefone do Responsável
							</p>
							<p>{{ item.telefoneResponsavel }}</p>
						</div>
						<div>
							<p class="text-xl font-extrabold text-black dark:text-white">
								Auditório
							</p>
							<p>{{ item.audNome }}</p>
						</div>
						<div>
							<p class="text-xl font-extrabold text-black dark:text-white">
								Coordenação (auditório)
							</p>
							<p>{{ item.audCoord }}</p>
						</div>
						<div>
							<p class="text-xl font-extrabold text-black dark:text-white">
								Status da Reserva
							</p>
							<p>{{ item.status }}</p>
						</div>
						<div>
							<p class="text-xl font-extrabold text-black dark:text-white">
								Solicitado Por
							</p>
							<p>{{ item.solicitadoPor }}</p>
						</div>
						<div>
							<p class="text-xl font-extrabold text-black dark:text-white">
								Aceito/Recusado Por
							</p>
							<p>{{ item.aceitoPor }}</p>
						</div>
						<div>
							<p class="text-xl font-extrabold text-black dark:text-white">
								Recursos do Auditório
							</p>
							<ul v-if="item.recursosAud.length > 0" class="list-disc text-start">
								<li v-for="recurso in item.recursosAud" :key="recurso">
									{{ recurso }}
								</li>
							</ul>
							<p v-else>
								Nenhum Recurso Solicitado
							</p>
						</div>
						<div>
							<p class="text-xl font-extrabold text-black dark:text-white">
								Datas
							</p>
							<ul class="list-disc">
								<li v-for="data in item.datashoras" :key="data">
									{{ data }}
								</li>
							</ul>
						</div>
						<div>
							<p class="text-xl font-extrabold text-black dark:text-white">
								Descrição
							</p>
							<p>{{ item.descricao }}</p>
						</div>
						<div>
							<p class="text-xl font-extrabold text-black dark:text-white">
								Observação
							</p>
							<p>{{ item.observacao }}</p>
						</div>
					</div>
					<div
						v-if="
							item.status === 'Aguardando'
								&& (userStore().level === 'Administrador'
									|| (userStore().level === 'Gerente' && item.audCoord.includes(userStore().coord)))
						"
						class="flex items-center justify-center mb-5 space-x-5"
					>
						<UButton
							label="Recusar"
							color="red"
							icon="i-heroicons-x-circle"
							@click="abrirRecusar(item._id)"
						/>
						<UButton
							label="Aprovar"
							color="green"
							icon="i-heroicons-check-circle"
							@click="abrirAprovar(item._id)"
						/>
					</div>
					<div
						v-if="
							item.status === 'Aprovado'
								&& (userStore().level === 'Administrador'
									|| (userStore().level === 'Gerente' && item.audCoord.includes(userStore().coord)))
								&& !useIsPassadoArr(item.datasArr)
						"
						class="flex items-center justify-center mb-5 space-x-5"
					>
						<UButton
							label="Cancelar"
							color="red"
							icon="i-heroicons-x-circle"
							@click="abrirCancelar(item._id)"
						/>
					</div>
				</UContainer>
			</template>
		</UAccordion>
		<template #footer>
			<div class="flex justify-between items-center">
				<UButton
					label="Baixar Planilha XLSX"
					variant="soft"
					icon="i-heroicons-table-cells"
					@click="navigateTo('/reservas.xlsx', { open: { target: '_blank' } })"
				/>
				<UPagination
					v-if="reservaLista"
					v-model="page"
					:page-count="pageCount"
					:total="reservaLista.length"
				/>
			</div>
		</template>
	</UCard>

	<UModal v-model="modalRecusar" :ui="{ width: '!w-2/5' }">
		<UCard
			:ui="{
				divide: 'divide-y divide-gray-100 dark:divide-gray-800',
				header: { background: 'bg-red-500' },
			}"
		>
			<template #header>
				<h3 class="text-center text-white select-none">
					Recusar Solicitação de Reserva
				</h3>
			</template>
			<span
				class="block mb-2 text-sm font-medium text-center text-gray-900 dark:text-white"
				for="excluir-form"
			>Tem certeza que deseja recusar esta solicitação?</span>
			<template #footer>
				<div class="flex justify-center space-x-4">
					<UButton
						label="Cancelar"
						color="green"
						icon="i-heroicons-x-circle"
						:disabled="loadingRecusar"
						@click="modalRecusar = false"
					/>
					<UButton
						label="Recusar"
						color="red"
						icon="i-heroicons-trash"
						:loading="loadingRecusar"
						@click="recusar"
					/>
				</div>
			</template>
		</UCard>
	</UModal>

	<UModal v-model="modalAprovar" :ui="{ width: '!w-2/5' }">
		<UCard
			:ui="{
				divide: 'divide-y divide-gray-100 dark:divide-gray-800',
				header: { background: 'bg-green-500' },
			}"
		>
			<template #header>
				<h3 class="text-center text-white select-none">
					Aprovar Solicitação de Reserva
				</h3>
			</template>
			<span
				class="block mb-2 text-sm font-medium text-center text-gray-900 dark:text-white"
				for="excluir-form"
			>Tem certeza que deseja aprovar esta solicitação?</span>
			<template #footer>
				<div class="flex justify-center space-x-4">
					<UButton
						label="Cancelar"
						color="red"
						icon="i-heroicons-x-circle"
						:disabled="loadingAprovar"
						@click="modalAprovar = false"
					/>
					<UButton
						label="Aprovar"
						color="green"
						icon="i-heroicons-check-circle"
						:loading="loadingAprovar"
						@click="aprovar"
					/>
				</div>
			</template>
		</UCard>
	</UModal>

	<UModal v-model="modalCancelar" :ui="{ width: '!w-2/5' }">
		<UCard
			:ui="{
				divide: 'divide-y divide-gray-100 dark:divide-gray-800',
				header: { background: 'bg-red-500' },
			}"
		>
			<template #header>
				<h3 class="text-center text-white select-none">
					Cancelar Reserva
				</h3>
			</template>
			<span
				class="block mb-2 text-sm font-medium text-center text-gray-900 dark:text-white"
				for="excluir-form"
			>Tem certeza que deseja cancelar esta reserva?</span>
			<template #footer>
				<div class="flex justify-center space-x-4">
					<UButton
						label="Sair"
						color="green"
						icon="i-heroicons-check-circle"
						:disabled="loadingCancelar"
						@click="modalCancelar = false"
					/>
					<UButton
						label="Cancelar Reserva"
						color="red"
						icon="i-heroicons-x-circle"
						:loading="loadingCancelar"
						@click="cancelar"
					/>
				</div>
			</template>
		</UCard>
	</UModal>
</template>
