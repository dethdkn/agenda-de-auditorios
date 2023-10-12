export default defineStore(
	'user',
	() => {
		const token = ref('')
		const isLoggedIn = ref(false)
		const idcbpf = ref('')
		const level = ref('')
		const coord = ref<string[]>([])

		const setUserState = (
			tokenV: string,
			isLoggedInV: boolean,
			idcbpfV: string,
			levelV: string,
			coordV: string[] = []
		) => {
			token.value = tokenV
			isLoggedIn.value = isLoggedInV
			idcbpf.value = idcbpfV
			level.value = levelV
			coord.value = coordV
		}

		const clearUserState = () => {
			token.value = ''
			isLoggedIn.value = false
			idcbpf.value = ''
			level.value = ''
			coord.value = []
		}

		return {token, isLoggedIn, idcbpf, level, coord, setUserState, clearUserState}
	},
	{persist: true}
)
