import { Carousel, Slide } from 'vue3-carousel'

export default defineNuxtPlugin(({ vueApp }) => {
	vueApp.component('Carousel', Carousel)
	vueApp.component('Slide', Slide)
})
