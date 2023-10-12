<script setup lang="ts">
const opcoesFiltro = computed(() => {
	const filtros: string[] = ['Auditório', 'Coordenação']
	if (userStore().idcbpf) filtros.push('Solicitados por mim')
	else if (2 >= 0 && 2 < filtros.length) filtros.splice(2, 1)
	return filtros
})
const filtro = ref('Auditório')
const auditorioSelecionado = ref('Selecione')
const coordenacaoSelecionada = ref('Selecione')
const usuarioSelecionado = ref('')
const limparFiltros = () => {
	auditorioSelecionado.value = 'Selecione'
	coordenacaoSelecionada.value = 'Selecione'
	if (filtro.value === 'Solicitados por mim') usuarioSelecionado.value = userStore().idcbpf
	else usuarioSelecionado.value = ''
}

const {data, error} = await useFetch('/api/fetch/reservas-aprovadas', {
	method: 'post',
	body: {
		coord: coordenacaoSelecionada,
		auditorio: auditorioSelecionado,
		uid: usuarioSelecionado
	}
})
if (error.value) {
	const err = (error.value as any).data
	if (err) {
		const {statusCode, statusMessage, message} = err
		throw createError({statusCode, statusMessage, message})
	}
}

const {data: auditorios, error: error2} = await useFetch('/api/fetch/auditorios')
if (error2.value) {
	const err = (error2.value as any).data
	if (err) {
		const {statusCode, statusMessage, message} = err
		throw createError({statusCode, statusMessage, message})
	}
}
const auditoriosNomes = computed(() => {
	const nomes: string[] = ['Selecione']
	if (auditorios.value) for (const aud of auditorios.value) nomes.push(aud.nome)
	return nomes
})

const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')
const {height} = useWindowSize()
const rows = ref(2)
watch(height, (nv) => {
	if (nv < 650) return (rows.value = 1)
	return (rows.value = 2)
})

const reservas = computed(() => {
	const reservas: {
		key: string | undefined
		highlight: string
		popover: {
			label: string
			visibility: 'hover' | 'click'
			color: string
			audNome: string
			coord: string
			solicitadoPor: string
			inicio: string
			fim: string
		}
		dates: Date
	}[] = []
	if (data.value)
		for (const reservaBD of data.value)
			for (const dataMarcada of reservaBD.datas) {
				reservas.push({
					key: reservaBD._id,
					highlight:
						useCalendarColors[
							useAuditorioColor(reservaBD.audNome, auditorios.value ? auditorios.value : [])
						],
					popover: {
						label: `${reservaBD.nomeEvento}, ${reservaBD.tipoEvento} - ${reservaBD.audNome}`,
						visibility: 'hover',
						color:
							useCalendarColors[
								useAuditorioColor(reservaBD.audNome, auditorios.value ? auditorios.value : [])
							],
						audNome: reservaBD.audNome,
						coord: reservaBD.audCoord,
						solicitadoPor: reservaBD.solicitadoPor ? reservaBD.solicitadoPor : '',
						inicio: dataMarcada.inicio,
						fim: dataMarcada.fim
					},
					dates: new Date(dataMarcada.data)
				})
			}
	return reservas
})

const {SITE_URL} = useRuntimeConfig().public
const {copy} = useClipboard()
const copiar = () => {
	let url = `${SITE_URL}/calendario.ics`
	if (filtro.value === 'Auditório' && auditorioSelecionado.value !== 'Selecione')
		url = `${url}?aud=${auditorioSelecionado.value}`
	if (filtro.value === 'Coordenação' && coordenacaoSelecionada.value !== 'Selecione')
		url = `${url}?coord=${coordenacaoSelecionada.value}`
	if (filtro.value === 'Solicitados por mim') url = `${url}?uid=${userStore().idcbpf}`
	copy(url)
	useToast().add({
		title: 'URL copiada com sucesso!',
		icon: 'i-heroicons-check-badge',
		color: 'green'
	})
}

const modalDetalhes = ref(false)
const dataDetalhes = ref(new Date())
const reservasDetalhes = ref<Reserva[]>([])
const reservasDetalhesItem = computed(() => {
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
	for (const reserva of reservasDetalhes.value) {
		const datasArr: Date[] = []
		const datasString: string[] = []
		const datasHorasString: string[] = []
		for (const data of reserva.datas) {
			datasArr.push(new Date(data.data))
			datasString.push(new Date(data.data).toLocaleDateString('pt-br'))
			datasHorasString.push(
				`${new Date(data.data).toLocaleDateString('pt-br')} das ${data.inicio} às ${data.fim}`
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
			datasArr: datasArr,
			datas: datasString.join(' | '),
			icon: 'i-heroicons-check',
			color: 'green',
			disabled: false
		})
	}
	return items
})
const abrirDetalhes = ({year, month, day}: {year: number; month: number; day: number}) => {
	dataDetalhes.value = new Date(year, month - 1, day)
	reservasDetalhes.value = []
	if (data.value)
		reservasDetalhes.value = (data.value as unknown as Reserva[]).filter((entry) => {
			for (const dbData of entry.datas) {
				if (new Date(dbData.data).getTime() === dataDetalhes.value.getTime()) return true
			}
			return false
		})
	modalDetalhes.value = true
}
</script>

<template>
	<UCard
		class="w-full min-h-[calc(100vh-131px)] pt-4"
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
		<template #header>
			<h2 class="text-xl font-semibold leading-tight text-center text-gray-900 dark:text-white">
				Calendário de Eventos
			</h2>
			<div class="flex items-center justify-between mt-5">
				<UPopover :ui="{width: 'max-w-4xl'}">
					<UButton icon="i-heroicons-list-bullet" label="Legenda" variant="ghost" />
					<template #panel>
						<div class="grid grid-cols-3 gap-4 p-6 place-items-center">
							<div
								class="flex items-center justify-start w-full"
								v-for="(auditorio, i) in auditorios"
							>
								<svg
									:class="`text-${
										useCalendarColors.length <= 14 ? useCalendarColors[i] : 'gray'
									}-500`"
									xmlns="http://www.w3.org/2000/svg"
									width="15"
									height="15"
									viewBox="0 0 36 36"
								>
									<path
										fill="currentColor"
										d="M18 4a14 14 0 1 0 14 14A14 14 0 0 0 18 4Z"
										class="clr-i-solid clr-i-solid-path-1"
									/>
									<path fill="none" d="M0 0h36v36H0z" />
								</svg>
								<p class="ms-3">{{ auditorio.nome }}</p>
							</div>
						</div>
					</template>
				</UPopover>
				<div>
					<div class="[&>*]:inline-block inline-block">
						<span>Filtrar Calendário Por</span>
						<USelectMenu
							class="!w-52 ms-4"
							v-model="filtro"
							:options="opcoesFiltro"
							searchable
							searchable-placeholder="Pesquisar..."
							@change="limparFiltros"
						/>
					</div>
					<div class="[&>*]:inline-block inline-block">
						<USelectMenu
							v-if="filtro === 'Auditório'"
							class="!w-52 ms-4"
							v-model="auditorioSelecionado"
							:options="auditoriosNomes"
							searchable
							searchable-placeholder="Pesquisar..."
						/>
						<USelectMenu
							v-if="filtro === 'Coordenação'"
							class="!w-52 ms-4"
							v-model="coordenacaoSelecionada"
							:options="['Selecione', ...useCoordenacoes]"
							searchable
							searchable-placeholder="Pesquisar..."
						/>
					</div>
				</div>
			</div>
		</template>
		<ClientOnly>
			<template #fallback>
				<USkeleton class="w-full h-96" />
			</template>
			<Calendar
				expanded
				locale="pt-BR"
				:is-dark="isDark"
				:rows="rows"
				borderless
				:attributes="reservas"
				@dayclick="abrirDetalhes"
			>
				<template #day-popover="{attributes}">
					<div v-for="atributo in attributes" class="flex items-center justify-start mx-2 my-1">
						<span class="hidden">
							{{ atributo.popover }} {{ atributo.popover.solicitadoPor }}
						</span>
						<svg
							v-if="
								(coordenacaoSelecionada === 'Selecione' &&
									auditorioSelecionado === 'Selecione' &&
									filtro !== 'Solicitados por mim') ||
								(filtro === 'Auditório' && auditorioSelecionado === atributo.popover.audNome) ||
								(filtro === 'Coordenação' && coordenacaoSelecionada === atributo.popover.coord) ||
								(filtro === 'Solicitados por mim' &&
									atributo.popover.solicitadoPor === userStore().idcbpf)
							"
							:class="`text-${atributo.popover.color}-500`"
							xmlns="http://www.w3.org/2000/svg"
							width="8"
							height="8"
							viewBox="0 0 36 36"
						>
							<path
								fill="currentColor"
								d="M18 4a14 14 0 1 0 14 14A14 14 0 0 0 18 4Z"
								class="clr-i-solid clr-i-solid-path-1"
							/>
							<path fill="none" d="M0 0h36v36H0z" />
						</svg>
						<p
							v-if="
								(coordenacaoSelecionada === 'Selecione' &&
									auditorioSelecionado === 'Selecione' &&
									filtro !== 'Solicitados por mim') ||
								(filtro === 'Auditório' && auditorioSelecionado === atributo.popover.audNome) ||
								(filtro === 'Coordenação' && coordenacaoSelecionada === atributo.popover.coord) ||
								(filtro === 'Solicitados por mim' &&
									atributo.popover.solicitadoPor === userStore().idcbpf)
							"
							class="text-sm ms-1"
						>
							{{ atributo.popover.label }} das {{ atributo.popover.inicio }} às
							{{ atributo.popover.fim }}
						</p>
					</div>
				</template>
			</Calendar>
		</ClientOnly>
		<template #footer>
			<div class="flex mt-5 space-x-2 place-content-center">
				<UPopover mode="hover" :ui="{width: 'max-w-md'}">
					<UButton
						icon="i-heroicons-clipboard-document"
						label="Copiar URL do calendário"
						color="green"
						@click="copiar"
					/>
					<template #panel>
						<div class="p-6">
							<p class="pb-3 font-bold">
								Para utilizar a URL de importação, você deve seguir alguns passos simples:
							</p>
							<ul class="list-disc">
								<li class="pb-3">Clique no botão abaixo para copiar a URL do calendário</li>
								<li class="pb-3">
									Acesse a configuração de importação/inscrição no seu calendário.
								</li>
								<li class="pb-3">Cole a URL copiada.</li>
								<li class="pb-3">
									Confirme a importação/inscrição e pronto! Os eventos serão adicionados
									automaticamente a todos os calendários vinculados à sua conta.
								</li>
							</ul>
							<p class="text-sm font-bold underline">
								Ao clica no botão abaixo, você irá copiar a URL com os mesmos filtros do calendário
								acima
							</p>
						</div>
					</template>
				</UPopover>
			</div>
		</template>
	</UCard>
	<UModal v-model="modalDetalhes" :ui="{width: '!w-4/5'}">
		<UCard
			:ui="{
				divide: 'divide-y divide-gray-100 dark:divide-gray-800',
				header: {background: 'bg-cyan-500'}
			}"
		>
			<template #header>
				<h3 class="text-center text-white">
					Reservas -
					{{
						dataDetalhes.toLocaleDateString('pt-br', {
							weekday: 'long',
							year: 'numeric',
							month: 'long',
							day: 'numeric'
						})
					}}
				</h3>
			</template>
			<UAccordion v-if="reservasDetalhesItem.length > 0" :items="reservasDetalhesItem">
				<template #default="{item, open}">
					<UButton
						variant="ghost"
						class="border-b border-gray-200 dark:border-gray-700"
						:ui="{rounded: 'rounded-none', padding: {sm: 'p-3'}}"
					>
						<template #leading>
							<div
								class="flex items-center justify-center w-6 h-6 -my-1 rounded-full"
								:class="`bg-green-500`"
							>
								<UIcon :name="item.icon" class="w-5 h-5 text-white dark:text-gray-900" />
							</div>
						</template>
						<span class="truncate">
							<span :class="`text-green-500`">
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
				<template #item="{item}">
					<UContainer>
						<div class="grid grid-cols-3 gap-4 mb-10 text-center place-items-center">
							<div>
								<p class="text-xl font-extrabold text-black dark:text-white">Nome do Evento</p>
								<p>{{ item.nomeEvento }}</p>
							</div>
							<div>
								<p class="text-xl font-extrabold text-black dark:text-white">Tipo do Evento</p>
								<p>{{ item.tipoEvento }}</p>
							</div>
							<div>
								<p class="text-xl font-extrabold text-black dark:text-white">
									Instituição Responsável
								</p>
								<p>{{ item.instResponsavel }}</p>
							</div>
							<div>
								<p class="text-xl font-extrabold text-black dark:text-white">Nome do Responsável</p>
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
								<p class="text-xl font-extrabold text-black dark:text-white">Auditório</p>
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
									Recursos do Auditório
								</p>
								<ul class="list-disc text-start" v-if="item.recursosAud.length > 0">
									<li v-for="recurso in item.recursosAud">{{ recurso }}</li>
								</ul>
								<p v-else>Nenhum Recurso Solicitado</p>
							</div>
							<div>
								<p class="text-xl font-extrabold text-black dark:text-white">Datas</p>
								<ul class="list-disc">
									<li v-for="data in item.datashoras">{{ data }}</li>
								</ul>
							</div>
							<div>
								<p class="text-xl font-extrabold text-black dark:text-white">Descrição</p>
								<p>{{ item.descricao }}</p>
							</div>
							<div>
								<p class="text-xl font-extrabold text-black dark:text-white">Solicitado Por</p>
								<p>{{ item.solicitadoPor }}</p>
							</div>
						</div>
					</UContainer>
				</template>
			</UAccordion>
			<p v-else class="text-center">Nenhuma reserva agendada para a data selecionada.</p>
			<template #footer>
				<div class="flex justify-center space-x-4">
					<UButton
						label="Fechar"
						color="green"
						icon="i-heroicons-arrow-uturn-left"
						@click="modalDetalhes = false"
					/>
				</div>
			</template>
		</UCard>
	</UModal>
</template>
