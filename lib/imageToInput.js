const util = require('util');
const Jimp = require('jimp');

module.exports = async function imageToInput(img) {
	const binaryImage = await util.promisify(img.getBuffer.bind(img))('image/jpeg');
	return [...(await Jimp.read(binaryImage)).bitmap.data].map(x => x / 256);
};
