const Jimp = require('jimp');

module.exports = async function imageToInput(img) {
	const binaryImage = await util.promisify(img.getBuffer.bind(img))('image/bmp');
	return [...(await Jimp.read(binaryImage)).bitmap.data].map(x => x / 256);
};
