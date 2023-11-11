import type { Files } from 'formidable'

declare global {
	type FormidableFiles = Files
}

export { FormidableFiles }
