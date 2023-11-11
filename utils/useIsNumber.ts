export default (e: KeyboardEvent): void => {
	if (!/\d/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Tab')
		return e.preventDefault()
}
