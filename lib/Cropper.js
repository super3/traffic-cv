const Stream = require('./Stream');
const Jimp = require('jimp');

module.exports = class Cropper extends Stream {
	constructor(x, y, w, h) {
		super();

		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}

	async write(img) {
		if(!(img instanceof Jimp))
			img = await Jimp.read(img);

		this.emit('data', await img.crop(this.x - (this.w / 2), this.y - (this.h / 2), this.w, this.h));
	}
};
