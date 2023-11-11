<script setup lang="ts">
definePageMeta({
	pageTransition: {
		name: 'slide-left',
		mode: 'out-in',
	},
})
useHead({
	title: 'Sobre',
})
defineOgImage({
	title: `Agenda de Auditórios | Sobre`,
	component: 'Og',
})
useSeoMeta({
	description:
		'Esta página foi criada com o propósito de disponibilizar a infraestrutura das salas e auditórios de uso comum, bem como facilitar o processo de reserva online desses espaços. Essa iniciativa visa otimizar a logística dos setores envolvidos na organização e realização de eventos e reuniões no CBPF (Centro Brasileiro de Pesquisas Físicas).',
})
</script>

<template>
	<section
		class="min-h-[calc(100vh-131px)] bg-[url('~/assets/images/minja.webp')] bg-cover bg-center bg-no-repeat"
	>
		<div class="flex flex-col items-center justify-center px-6 mx-auto min-h-[calc(100vh-131px)]">
			<div
				class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-4xl xl:p-0 dark:bg-gray-800 dark:border-gray-700"
			>
				<div class="p-6 space-y-4 text-center md:space-y-6 sm:p-8">
					<h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl">
						Sobre
					</h1>
					<p
						class="font-bold leading-tight tracking-tight text-gray-900 text-md md:text-xl dark:text-white"
					>
						Esta página foi criada com o propósito de disponibilizar a infraestrutura das salas e auditórios de uso comum, bem como facilitar o processo de reserva online desses espaços. Essa iniciativa visa otimizar a logística dos setores envolvidos na organização e realização de eventos e reuniões no CBPF (Centro Brasileiro de Pesquisas Físicas).
					</p>
					<h3>Equipe de Desenvolvimento:</h3>
					<ul class="list-unstyled space-y-2">
						<li>
							<span class="font-bold">Coordenador:</span> Marcelo P. Albuquerque
						</li>
						<li>
							<span class="font-bold">Gestora:</span> Denise Coutinho
						</li>
						<li>
							<span class="font-bold">Dev Full-stack:</span> <a href="https://rosa.dev.br" target="_blank">Gabriel Rosa</a>
						</li>
						<li>
							<span class="font-bold">Dev Front-end:</span> Tiago Martins
						</li>
						<li>
							<span class="font-bold">Dev Back-end:</span> Gustavo Cabral
						</li>
						<li>
							<span class="font-bold">Fotos & Textos:</span> NCS - CBPF
						</li>
						<li>
							<span class="font-bold">Desenvolvido originalmente por:</span> Leandro M. Barbosa <svg class="inline-block" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M10.5 2h3v6H19v3h-5.5v11h-3V11H5V8h5.5V2Z" /></svg>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</section>
</template>
