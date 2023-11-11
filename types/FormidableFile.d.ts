import type { File } from 'formidable'

declare global {
	type FormidableFile = File
}

export { FormidableFile }
