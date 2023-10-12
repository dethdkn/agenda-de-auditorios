import {formidable} from 'formidable'

export default (e: H3Req): Promise<{fields: FormidableFields; files: FormidableFiles}> => {
	return new Promise((resolve, reject) => {
		formidable({maxFileSize: 100 * 1024 * 1024}).parse(e, (err, fields, files) => {
			if (err) {
				new Erro({
					erro: {
						info: 'Erro ao decodificar dados enviados',
						err
					}
				}).save()
				return reject('Erro ao decodificar dados enviados')
			}
			return resolve({fields, files})
		})
	})
}
