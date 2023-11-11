<template>
	<NuxtLoadingIndicator color="#2563eb" :height="5" />
	<Header @contextmenu.prevent />
	<main class="min-h-[calc(100vh-131px)]" @contextmenu.prevent>
		<slot />
		<UNotifications />
	</main>
	<Footer @contextmenu.prevent />
</template>
