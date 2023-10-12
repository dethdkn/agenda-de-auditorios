<script setup lang="ts">
const {data: auditorios, error} = await useFetch('/api/fetch/auditorios')
if (error.value) {
	const err = (error.value as any).data
	if (err) {
		const {statusCode, statusMessage, message} = err
		throw createError({statusCode, statusMessage, message})
	}
}
const {data: tiposEventos, error: error2} = await useFetch('/api/fetch/tiposeventos')
if (error2.value) {
	const err = (error2.value as any).data
	if (err) {
		const {statusCode, statusMessage, message} = err
		throw createError({statusCode, statusMessage, message})
	}
}
const {data: instituicoes, error: error3} = await useFetch('/api/fetch/instituicoes')
if (error3.value) {
	const err = (error3.value as any).data
	if (err) {
		const {statusCode, statusMessage, message} = err
		throw createError({statusCode, statusMessage, message})
	}
}

const tabSelecionada = ref(0)
const changeTab = (i: number) => (tabSelecionada.value = i)

const slctAuditorio = ref('')
const slctAuditorioURL = ref('')
const nomeEvento = ref('')
const coordResp = ref('')
const capacidade = ref('')
const tipoEvento = ref('')
const instResponsavel = ref('')
const nomeResponsavel = ref('')
const emailResponsavel = ref('')
const telefoneResponsavel = ref('')
const quantidadeDatas = ref(1)
const datas = ref<Date[]>([])
const horaInicio = ref<string[]>([])
const horaFim = ref<string[]>([])
const recursosDisponiveis = ref<string[]>([])
const dataInicioSemana = ref(new Date())
const diasSemana = ref<boolean[]>([false, false, false, false, false, false, false])
const horaInicioSemana = ref<string[]>([])
const horaFimSemana = ref<string[]>([])
const repetir = ref(1)
const resultadoSemana = computed(() => {
	const resultado: {
		data: Date
		inicio: string
		fim: string
	}[] = []
	if (tabSelecionada.value === 1) {
		for (let diaNumero = 0; diaNumero < 7; diaNumero++) {
			if (diasSemana.value[diaNumero]) {
				const datasSelecionas = semanaParaData(dataInicioSemana.value, diaNumero, repetir.value)
				for (const dataSelecionada of datasSelecionas)
					resultado.push({
						data: dataSelecionada,
						inicio: horaInicioSemana.value[diaNumero],
						fim: horaFimSemana.value[diaNumero]
					})
			}
		}
	}
	resultado.sort((a, b) => a.data.getTime() - b.data.getTime())
	return resultado
})
const recursos = ref<boolean[]>([])
const descricao = ref('')
const observacao = ref('')
const checkSuporte = ref(false)
const loading = ref(false)

watch(slctAuditorio, async (novoNome) => {
	if (auditorios.value) {
		const audSelecionado = auditorios.value.find((obj) => obj.nome === novoNome)
		if (audSelecionado) {
			slctAuditorioURL.value = audSelecionado.url
			coordResp.value = audSelecionado.coordenacao
			capacidade.value = audSelecionado.capacidade.toString()
			recursos.value = []
			recursosDisponiveis.value = audSelecionado.itens
		}
	}
})

const removerData = () => {
	if (quantidadeDatas.value > 1) quantidadeDatas.value -= 1
}

const solicitar = () => {
	loading.value = true
	if (!slctAuditorio.value) {
		useToast().add({
			title: 'Selecione um auditório',
			icon: 'i-heroicons-exclamation-circle',
			color: 'amber'
		})
		loading.value = false
	} else if (!nomeEvento.value) {
		useToast().add({
			title: 'Informe o nome do evento',
			icon: 'i-heroicons-exclamation-circle',
			color: 'amber'
		})
		loading.value = false
	} else if (!tipoEvento.value) {
		useToast().add({
			title: 'Selecione o tipo do evento',
			icon: 'i-heroicons-exclamation-circle',
			color: 'amber'
		})
		loading.value = false
	} else if (!instResponsavel.value) {
		useToast().add({
			title: 'Informe a instituição/coordenação responsável do evento',
			icon: 'i-heroicons-exclamation-circle',
			color: 'amber'
		})
		loading.value = false
	} else if (!nomeResponsavel.value) {
		useToast().add({
			title: 'Informe o nome do responsável do evento',
			icon: 'i-heroicons-exclamation-circle',
			color: 'amber'
		})
		loading.value = false
	} else if (!emailResponsavel.value) {
		useToast().add({
			title: 'Informe o email do responsável do evento',
			icon: 'i-heroicons-exclamation-circle',
			color: 'amber'
		})
		loading.value = false
	} else if (!useValidateEmail(emailResponsavel.value)) {
		useToast().add({
			title: 'Informe um email válido',
			icon: 'i-heroicons-exclamation-circle',
			color: 'amber'
		})
		loading.value = false
	} else if (!telefoneResponsavel.value) {
		useToast().add({
			title: 'Informe o telefone do responsável do evento',
			icon: 'i-heroicons-exclamation-circle',
			color: 'amber'
		})
		loading.value = false
	} else if (!descricao.value) {
		useToast().add({
			title: 'Informe a descrição do evento',
			icon: 'i-heroicons-exclamation-circle',
			color: 'amber'
		})
		loading.value = false
	} else {
		let datasHoras: {data: Date; inicio: string; fim: string}[] = []
		if (tabSelecionada.value === 0) {
			for (let i = 0; i < quantidadeDatas.value; i++) {
				if (!datas.value[i] || !horaInicio.value[i] || !horaFim.value[i]) {
					useToast().add({
						title: `Informe a ${i + 1}ª data/horario do evento`,
						icon: 'i-heroicons-exclamation-circle',
						color: 'amber'
					})
					loading.value = false
					return
				}
				if (useIsPassado(datas.value[i])) {
					useToast().add({
						title: `A ${
							i + 1
						}ª data esta inválida (não é possivel criar uma solicitação para o passado)`,
						icon: 'i-heroicons-exclamation-circle',
						color: 'amber'
					})
					loading.value = false
					return
				}
				if (horaFim.value[i] < horaInicio.value[i]) {
					useToast().add({
						title: `O horario da ${
							i + 1
						}ª data esta inválido (horario de inicio deve ocorrer antes do horario final)`,
						icon: 'i-heroicons-exclamation-circle',
						color: 'amber'
					})
					loading.value = false
					return
				}
				for (let j = 0; j < quantidadeDatas.value; j++) {
					if (i !== j && datas.value[i].getTime() === datas.value[j].getTime()) {
						if (
							(horaInicio.value[i] > horaInicio.value[j] &&
								horaInicio.value[i] < horaFim.value[j]) ||
							(horaFim.value[i] > horaInicio.value[j] && horaFim.value[i] < horaFim.value[j])
						) {
							useToast().add({
								title: `O horario da ${i + 1}ª data esta em conflito com o horario da ${
									j + 1
								}ª data`,
								icon: 'i-heroicons-exclamation-circle',
								color: 'amber'
							})
							loading.value = false
							return
						}
					}
				}
			}
			for (let i = 0; i < quantidadeDatas.value; i++) {
				datasHoras.push({data: datas.value[i], inicio: horaInicio.value[i], fim: horaFim.value[i]})
			}
		} else {
			if (resultadoSemana.value.length < 1) {
				useToast().add({
					title: `Selecione pelo menos 1 data`,
					icon: 'i-heroicons-exclamation-circle',
					color: 'amber'
				})
				loading.value = false
				return
			}
			for (const resSemana of resultadoSemana.value) {
				if (useIsPassado(resSemana.data)) {
					useToast().add({
						title: `Não é possivel criar uma solicitação para o passado`,
						icon: 'i-heroicons-exclamation-circle',
						color: 'amber'
					})
					loading.value = false
					return
				}
				if (!resSemana.inicio) {
					useToast().add({
						title: `Selecione o horário de início`,
						icon: 'i-heroicons-exclamation-circle',
						color: 'amber'
					})
					loading.value = false
					return
				}
				if (!resSemana.fim) {
					useToast().add({
						title: `Selecione o horário final`,
						icon: 'i-heroicons-exclamation-circle',
						color: 'amber'
					})
					loading.value = false
					return
				}
				if (resSemana.fim < resSemana.inicio) {
					useToast().add({
						title: `Horário de início deve ocorrer antes do horario final`,
						icon: 'i-heroicons-exclamation-circle',
						color: 'amber'
					})
					loading.value = false
					return
				}
			}
			datasHoras = resultadoSemana.value
		}
		const recursosSolicitados: string[] = []
		for (const [index, value] of recursos.value.entries()) {
			if (value) recursosSolicitados.push(recursosDisponiveis.value[index])
		}
		if (!checkSuporte.value) {
			useToast().add({
				title: `Confirme a informação da Equipe de Suporte ao final da Página`,
				icon: 'i-heroicons-exclamation-triangle',
				color: 'red'
			})
			loading.value = false
			return
		}
		fetch('/api/insert/reserva', {
			method: 'POST',
			body: JSON.stringify({
				urlAuditorio: slctAuditorioURL.value,
				nomeEvento: nomeEvento.value,
				tipoEvento: tipoEvento.value,
				instResponsavel: instResponsavel.value,
				nomeResponsavel: nomeResponsavel.value,
				emailResponsavel: emailResponsavel.value,
				telefoneResponsavel: telefoneResponsavel.value,
				datasHoras: datasHoras,
				recursosSolicitados: recursosSolicitados,
				descricao: descricao.value,
				observacao: observacao.value
			})
		})
			.then(async (res) => {
				if (res.ok) {
					const result = await res.text()
					loading.value = false
					return useToast().add({
						title: result,
						icon: 'i-heroicons-check-badge',
						color: 'green',
						timeout: 60000
					})
				}
				const err: ErroReq = await res.json()
				loading.value = false
				useToast().add({
					title: err.message,
					icon: 'i-heroicons-exclamation-triangle',
					color: 'red'
				})
			})
			.catch(() => {
				loading.value = false
				useToast().add({
					title: 'Ocorreu um erro desconhecido',
					icon: 'i-heroicons-exclamation-triangle',
					color: 'red'
				})
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
			rounded: '',
			header: {padding: 'px-4 py-5'},
			footer: {padding: 'p-4'}
		}"
	>
		<template #header>
			<h2
				class="pt-3 text-xl font-semibold leading-tight text-center text-gray-900 dark:text-white"
			>
				Solicitar Reserva
			</h2>
		</template>
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 place-items-center">
			<div class="w-full">
				<label
					class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
					for="auditorio-solic"
					>Auditório</label
				>
				<USelectMenu
					id="auditorio-solic"
					icon="i-heroicons-tv"
					v-model="slctAuditorio"
					v-if="auditorios"
					:options="auditorios"
					value-attribute="nome"
					option-attribute="nome"
					searchable
					searchable-placeholder="Pesquisar..."
				/>
			</div>
			<div class="w-full">
				<label
					class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
					for="coord-solic"
					>Coordenação responsável pelo auditório</label
				>
				<UInput id="coord-solic" icon="i-heroicons-user-group" v-model="coordResp" disabled />
			</div>
			<div class="w-full">
				<label
					class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
					for="capacidade-solic"
					>Capacidade máxima do auditório</label
				>
				<UInput id="capacidade-solic" icon="i-heroicons-users" v-model="capacidade" disabled />
			</div>
			<div class="w-full">
				<label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="nome-solic"
					>Nome do Evento</label
				>
				<UInput id="nome-solic" icon="i-heroicons-bookmark" v-model="nomeEvento" />
			</div>
			<div class="w-full">
				<label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="tipo-solic"
					>Tipo do Evento</label
				>
				<USelectMenu
					id="tipo-solic"
					icon="i-heroicons-megaphone"
					v-model="tipoEvento"
					v-if="tiposEventos"
					:options="tiposEventos"
					value-attribute="nome"
					option-attribute="nome"
					searchable
					searchable-placeholder="Pesquisar..."
				/>
			</div>
			<div class="w-full">
				<label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="inst-solic"
					>Inst./Coord. responsável</label
				>
				<USelectMenu
					id="inst-solic"
					icon="i-heroicons-building-library"
					v-model="instResponsavel"
					v-if="instituicoes"
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
					for="nome-resp-solic"
					>Nome do Responsável</label
				>
				<UInput id="nome-resp-solic" icon="i-heroicons-user" v-model="nomeResponsavel" />
			</div>
			<div class="w-full">
				<label
					class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
					for="email-solic"
					>Email do Responsável</label
				>
				<UInput
					id="email-solic"
					icon="i-heroicons-envelope"
					v-model="emailResponsavel"
					@keydown.space.prevent
				/>
			</div>
			<div class="w-full">
				<label
					class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
					for="telefone-solic"
					>Telefone do Responsável</label
				>
				<UInput
					id="telefone-solic"
					icon="i-heroicons-phone"
					v-model="telefoneResponsavel"
					@keydown="useIsNumber"
				/>
			</div>
			<div class="w-full col-span-1 sm:col-span-3 md:col-span-3 lg:col-span-2">
				<UTabs
					@change="changeTab"
					:items="[
						{
							label: 'Agendar por Dia',
							slot: 'dia'
						},
						{
							label: 'Agendar por Semana',
							slot: 'semana'
						}
					]"
				>
					<template #dia>
						<div class="flex justify-center mt-6 space-x-2">
							<UButton
								icon="i-heroicons-calendar-days-20-solid"
								size="xs"
								label="Remover Data"
								color="red"
								variant="soft"
								@click="removerData"
							/>
							<UButton
								icon="i-heroicons-calendar-days-20-solid"
								size="xs"
								label="Adicionar Data"
								color="green"
								variant="soft"
								@click="quantidadeDatas++"
							/>
						</div>
						<span
							class="block mb-2 text-sm font-medium text-gray-900 ms-1 dark:text-white"
							for="data-solic"
							>Data(s) do Evento</span
						>
						<div
							class="mt-4 grid grid-cols-11 gap-4 place-items-center"
							v-for="i in quantidadeDatas"
						>
							<div class="w-full col-span-3">
								<VDatePicker v-model="datas[i - 1]" />
							</div>
							<div class="w-full text-center">
								<UBadge label="Das" variant="soft" />
							</div>
							<div class="w-full col-span-3">
								<USelectMenu
									id="inst-solic"
									icon="i-heroicons-clock"
									v-model="horaInicio[i - 1]"
									:options="useHorasInicio"
									searchable
									searchable-placeholder="Pesquisar..."
								/>
							</div>
							<div class="w-full text-center">
								<UBadge label="Às" variant="soft" />
							</div>
							<div class="w-full col-span-3">
								<USelectMenu
									id="inst-solic"
									icon="i-heroicons-clock"
									v-model="horaFim[i - 1]"
									:options="useHorasFim"
									searchable
									searchable-placeholder="Pesquisar..."
								/>
							</div>
						</div>
					</template>
					<template #semana>
						<div class="mt-6 grid grid-cols-2 gap-4 place-items-center">
							<div class="col-span-2 sm:col-span-1">
								<div
									class="mt-2 grid grid-cols-11 gap-4 place-items-center"
									v-for="(dia, i) in useDiasSemana"
								>
									<div class="flex items-center justify-start w-full col-span-3">
										<UToggle
											on-icon="i-heroicons-check-20-solid"
											off-icon="i-heroicons-x-mark-20-solid"
											color="green"
											v-model="diasSemana[i]"
										/>
										<span class="ms-2">{{ dia }}</span>
									</div>
									<div class="w-full text-center">
										<UBadge label="Das" variant="soft" />
									</div>
									<div class="w-full col-span-3">
										<USelectMenu
											id="inst-solic"
											icon="i-heroicons-clock"
											:options="useHorasInicio"
											searchable
											searchable-placeholder="Pesquisar..."
											v-model="horaInicioSemana[i]"
										/>
									</div>
									<div class="w-full text-center">
										<UBadge label="Às" variant="soft" />
									</div>
									<div class="w-full col-span-3">
										<USelectMenu
											id="inst-solic"
											icon="i-heroicons-clock"
											:options="useHorasFim"
											searchable
											searchable-placeholder="Pesquisar..."
											v-model="horaFimSemana[i]"
										/>
									</div>
								</div>
								<div class="w-full mt-6 text-center space-x-3">
									<span class="inline-block">A partir do dia</span>
									<div class="inline-block">
										<VDatePicker v-model="dataInicioSemana" />
									</div>
								</div>
								<div class="w-full mt-6 text-center space-x-3">
									<span class="inline-block">Repetir</span>
									<UInput
										:ui="{wrapper: 'w-10 inline-block'}"
										@keydown="useIsNumber"
										v-model="repetir"
									/>
									<span class="inline-block">Vez(es)</span>
								</div>
							</div>
							<div>
								<h3 v-if="resultadoSemana.length > 0" class="mb-5 text-center">Resultado:</h3>
								<p
									v-for="resultado in resultadoSemana"
									:key="resultado.data.toLocaleDateString('pt-br')"
									class="mb-1"
								>
									{{ resultado.data.toLocaleDateString('pt-br') }} das {{ resultado.inicio }} às
									{{ resultado.fim }}
								</p>
							</div>
						</div>
					</template>
				</UTabs>
			</div>
			<div class="w-full text-center sm:col-span-3 lg:col-span-1">
				<span
					class="block mb-2 text-sm font-medium text-gray-900 ms-1 dark:text-white"
					for="data-solic"
					>Recursos do Auditório</span
				>
				<div
					class="flex items-center justify-start md:ms-96 lg:ms-4"
					v-if="recursosDisponiveis.length > 0"
					v-for="(recursosD, i) in recursosDisponiveis"
					:key="recursosD"
				>
					<UToggle
						on-icon="i-heroicons-check-20-solid"
						off-icon="i-heroicons-x-mark-20-solid"
						color="green"
						v-model="recursos[i]"
					/>
					<span class="ms-2">{{ recursosD }}</span>
				</div>
				<span v-else class="block mb-2 text-sm font-medium text-gray-900 ms-1 dark:text-white"
					>Nenhum recurso disponível neste auditório</span
				>
			</div>
			<div class="w-full col-span-1 sm:col-span-3">
				<label
					class="block mb-2 text-sm font-medium text-gray-900 ms-1 dark:text-white"
					for="descricao-solic"
					>Descrição do Evento</label
				>
				<UTextarea id="descricao-solic" v-model="descricao" autoresize />
			</div>
			<div class="w-full col-span-1 sm:col-span-3">
				<label
					class="block mb-2 text-sm font-medium text-gray-900 ms-1 dark:text-white"
					for="observacao-solic"
					>Observações</label
				>
				<UTextarea id="observacao-solic" v-model="observacao" autoresize />
			</div>
			<div class="flex items-center justify-center w-full col-span-1 sm:col-span-3">
				<UCheckbox
					v-model="checkSuporte"
					name="checkSuporte"
					label="Confirmo que o horário de atendimento da Equipe de Suporte da COTEC para uso dos auditórios é de 8h30 as 17h30, de segunda a sexta-feira. A reserva que extrapolar horário e dia supracitados necessita da contratação de equipe técnica complementar."
				/>
			</div>
		</div>
		<div class="pt-5 text-center">
			<UButton
				icon="i-heroicons-check-circle"
				label="Solicitar"
				color="green"
				@click="solicitar"
				:loading="loading"
			/>
		</div>
	</UCard>
</template>
