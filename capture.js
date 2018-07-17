const fs = require('mz/fs');
const axios = require('axios');
const util = require('util');
const Jimp = require('jimp');

const cameras = [
	38
];

setInterval(async () => {
	await Promise.all(cameras.map(async id => {
		const res = await axios({
			method: 'get',
			responseType: 'arraybuffer',
			url: `http://traffic.sandyspringsga.gov/CameraImage.ashx?cameraId=${id}`
		});

		const image = await Jimp.read(res.data);
		await image.crop(122-8, 94-15, 16, 30);

		await fs.writeFile(`images/${id}-${Date.now()}.jpeg`, await util.promisify(image.getBuffer.bind(image))('image/jpeg'));
	}));
}, 1000 / 5);
