import type { Fields } from 'formidable'

declare global {
	type FormidableFields = Fields
}

export { FormidableFields }
