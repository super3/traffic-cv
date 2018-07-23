const Jimp = require('jimp');

module.exports = async function cropFromCenter(img, x, y, w, h) {
	if(!(img instanceof Jimp))
		img = await Jimp.read(img);

 	return await img.crop(x - (w/2), y - (h/2), w, h);
};
