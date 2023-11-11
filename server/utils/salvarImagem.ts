import jimp from 'jimp'

const { IMAGES_PATH } = useRuntimeConfig()

export default (arq: FormidableFile): Promise<string> => {
	return new Promise(async (resolve, reject) => {
		try {
			const fileName = `${Date.now()}.webp`
			const foto = await jimp.read(arq.filepath)
			foto.cover(1920, 1080).write(`${IMAGES_PATH}${fileName}`)
			return resolve(fileName)
		}
		catch (err) {
			new Erro({
				erro: {
					info: 'Erro ao salvar imagem no servidor',
					err,
				},
			}).save()
			return reject('Erro ao salvar imagem')
		}
	})
}
