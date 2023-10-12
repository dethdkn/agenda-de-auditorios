<script setup lang="ts">
const menuClosed = ref(true)

const isDark = computed({
	get() {
		return useColorMode().value === 'dark'
	},
	set() {
		useColorMode().preference = useColorMode().value === 'dark' ? 'light' : 'dark'
	}
})

const {currentRoute: route} = useRouter()
const checkRoute = (current: string = '', nav: string[]) => {
	return nav.includes(current)
		? 'text-white bg-blue-700 lg:bg-transparent lg:text-blue-700 lg:dark:text-blue-500'
		: 'text-gray-900 hover:bg-gray-100 lg:hover:bg-transparent lg:hover:text-blue-700 dark:text-white lg:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700'
}

const {idcbpf, level, coord} = storeToRefs(userStore())

const picture = ref('')
const baixarFoto = async () => {
	const {data} = await useFetch('/picture', {
		method: 'post',
		body: {idcbpf: idcbpf.value}
	})
	if (data.value) return (picture.value = data.value)
	picture.value = ''
}
if (userStore().isLoggedIn) {
	baixarFoto()
}
watch(idcbpf, () => {
	baixarFoto()
})

const userMenu = computed(() => {
	return [
		[
			{
				label: idcbpf.value,
				icon: 'i-heroicons-user-circle'
			},
			{
				label: level.value,
				icon: 'i-heroicons-ticket'
			},
			{
				label: coord.value.join(', '),
				icon: 'i-heroicons-user-group'
			}
		],
		[
			{
				label: 'Sair',
				icon: 'i-heroicons-arrow-right-on-rectangle',
				click: logout
			}
		]
	]
})

const logout = () => {
	userStore().clearUserState()
	navigateTo('/login')
}
</script>

<template>
	<nav class="bg-slate-50 dark:bg-gray-800">
		<div
			class="flex flex-wrap items-center justify-center p-4 mx-auto max-w-screen-xl sm:justify-between"
		>
			<NuxtLink to="/" class="flex items-center">
				<ClientOnly>
					<img
						v-if="isDark"
						src="~/assets/images/cbpf-white.svg"
						class="h-8 mr-3"
						alt="Logo do Centro Brasileiro de Pesquisas Físicas"
					/>
					<img
						v-else
						src="~/assets/images/cbpf-color.svg"
						class="h-8 mr-3"
						alt="Logo do Centro Brasileiro de Pesquisas Físicas"
					/>
					<template #fallback>
						<USkeleton class="w-8 h-8 mr-3" :ui="{rounded: 'rounded-full'}" />
					</template>
				</ClientOnly>
				<span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"
					>Agenda de Auditórios</span
				>
			</NuxtLink>
			<div class="flex items-center mt-4 lg:order-2 sm:mt-0">
				<UDropdown
					:items="userMenu"
					:popper="{placement: 'bottom-start'}"
					v-if="userStore().isLoggedIn"
				>
					<img
						v-if="picture"
						class="w-8 h-8 rounded-full"
						:src="'data:image/jpeg;base64,' + picture"
						:alt="idcbpf"
					/>
					<img
						v-else
						class="w-8 h-8 rounded-full"
						src="~/assets/images/nopic.webp"
						alt="Usuário sem foto"
					/>
				</UDropdown>
				<UButton
					v-else
					icon="i-heroicons-arrow-left-on-rectangle"
					size="sm"
					color="gray"
					variant="solid"
					label="Acessar"
					to="/login"
				/>
				<ClientOnly>
					<UButton
						:icon="isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'"
						color="gray"
						aria-label="Tema"
						@click="isDark = !isDark"
						class="ms-4"
					/>
					<template #fallback>
						<USkeleton class="w-8 h-8 ms-4" />
					</template>
				</ClientOnly>
				<button
					class="inline-flex items-center justify-center w-10 h-10 p-2 text-sm text-gray-500 rounded-lg ms-2 lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
					@click="menuClosed = !menuClosed"
				>
					<svg
						class="w-5 h-5"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 17 14"
					>
						<path
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M1 1h15M1 7h15M1 13h15"
						/>
					</svg>
				</button>
			</div>
			<div
				class="items-center justify-between w-full lg:flex lg:w-auto lg:order-1"
				:class="{hidden: menuClosed}"
			>
				<ul
					class="flex flex-col p-4 mt-4 font-medium border border-gray-100 rounded-lg lg:p-0 bg-gray-50 lg:flex-row lg:space-x-8 lg:mt-0 lg:border-0 lg:bg-slate-50 dark:bg-gray-800 lg:dark:bg-gray-800 dark:border-gray-700"
				>
					<li>
						<NuxtLink
							to="/"
							@click="menuClosed = true"
							:class="checkRoute(route.fullPath, ['/'])"
							class="block py-2 pl-3 pr-4 rounded lg:p-0"
							>Conheça</NuxtLink
						>
					</li>
					<li>
						<NuxtLink
							to="/calendario"
							@click="menuClosed = true"
							class="block py-2 pl-3 pr-4 rounded lg:p-0"
							:class="checkRoute(route.fullPath, ['/calendario'])"
							>Calendário</NuxtLink
						>
					</li>
					<li v-if="['Administrador'].includes(level)">
						<NuxtLink
							to="/auditorios"
							@click="menuClosed = true"
							:class="checkRoute(route.fullPath, ['/auditorios'])"
							class="block py-2 pl-3 pr-4 rounded lg:p-0"
							>Auditórios</NuxtLink
						>
					</li>
					<li v-if="['Administrador'].includes(level)">
						<NuxtLink
							to="/usuarios"
							@click="menuClosed = true"
							:class="checkRoute(route.fullPath, ['/usuarios'])"
							class="block py-2 pl-3 pr-4 rounded lg:p-0"
							>Usuários</NuxtLink
						>
					</li>
					<li v-if="['Administrador', 'Gerente', 'Secretária', 'Externo'].includes(level)">
						<NuxtLink
							to="/solicitar-reserva"
							@click="menuClosed = true"
							:class="checkRoute(route.fullPath, ['/solicitar-reserva'])"
							class="block py-2 pl-3 pr-4 rounded lg:p-0"
							>Solicitar Reserva</NuxtLink
						>
					</li>
					<li v-if="['Administrador', 'Gerente', 'Secretária', 'Técnico'].includes(level)">
						<NuxtLink
							to="/reservas"
							@click="menuClosed = true"
							:class="checkRoute(route.fullPath, ['/reservas'])"
							class="block py-2 pl-3 pr-4 rounded lg:p-0"
							>Reservas</NuxtLink
						>
					</li>
					<li>
						<NuxtLink
							to="/sobre"
							@click="menuClosed = true"
							:class="checkRoute(route.fullPath, ['/sobre'])"
							class="block py-2 pl-3 pr-4 rounded lg:p-0"
							>Sobre</NuxtLink
						>
					</li>
				</ul>
			</div>
		</div>
	</nav>
</template>
