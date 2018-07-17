const Jimp = require('jimp');

module.exports = async function loadImage(path, prependDirectory = true) {
	const image = await Jimp.read(`${ prependDirectory ? `${__dirname}/../images/` : '' }${path}`);

	/*
	image.resize(20, Jimp.AUTO); */

	return [ ...image.bitmap.data ].map(x => x / 256);
};
