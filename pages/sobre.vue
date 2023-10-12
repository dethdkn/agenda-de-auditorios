<script setup lang="ts">
definePageMeta({
	pageTransition: {
		name: 'slide-left',
		mode: 'out-in'
	}
})
useHead({
	title: `Agenda de Auditórios - Sobre`
})
</script>

<template>
	<section
		class="min-h-[calc(100vh-131px)] bg-[url('~/assets/images/cbpf.webp')] bg-cover bg-center bg-no-repeat"
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
							class="font-bold leading-tight tracking-tight text-gray-900 text-md md:text-2xl dark:text-white"
						>
							<p>
								Esta página tem como objetivo disponibilizar a infraestrutura das salas e auditórios de
								uso comum e proporcionar a reserva online dos mesmos facilitando assim a logistica dos
								setores envolvidos na realização dos eventos.
							</p>
							<h3>Equipe de Desenvolvimento:</h3>
							<ul class="list-unstyled">
								<li>
									<p class="m-1"><span class="font-bold">Coordenador:</span> Marcelo P. Albuquerque</p>
								</li>
								<li>
									<p class="m-1"><span class="font-bold">Gestora:</span> Denise Coutinho</p>
								</li>
								<li>
									<p class="m-1"><span class="font-bold">Dev Full-stack:</span> <a href="https://rosa.dev.br" target="_blank">Gabriel Rosa</a></p>
								</li>
								<li>
									<p class="m-1"><span class="font-bold">Dev Front-end:</span> Tiago Martins</p>
								</li>
								<li>
									<p class="m-1"><span class="font-bold">Dev Back-end:</span> Gustavo Cabral</p>
								</li>
								<li>
									<p class="m-1"><span class="font-bold">Fotos & Textos:</span> NCS - CBPF</p>
								</li>
								<li>
									<p class="m-1"><span class="font-bold">Desenvolvido originalmente por:</span> Leandro M. Barbosa <svg class="inline-block" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M10.5 2h3v6H19v3h-5.5v11h-3V11H5V8h5.5V2Z"/></svg></p>
								</li>
							</ul>
						</p>
					</div>
				</div>
			</div>
	</section>
</template>
