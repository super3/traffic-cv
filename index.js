const fs = require('fs');
const axios = require('axios');
const io = require('socket.io')(3052);
const Jimp = require('jimp');
const util = require('util');

const net = require('./lib/net');

const cameras = [
	38
];

io.on('connection', socket => {
	socket.emit('cameras', cameras);
});

async function cropFromCenter(img, x, y, w, h) {
	if(!(img instanceof Jimp))
		img = await Jimp.read(img);

 	return await img.crop(x - (w/2), y - (h/2), w, h);
}

async function imageToInput(img) {
	const binaryImage = await util.promisify(image.getBuffer.bind(image))('image/jpeg');
	return [...(await Jimp.read(binaryImage)).bitmap.data].map(x => x / 256);
}

const indexOfMax = arr => arr.indexOf(Math.max(...arr));

function getState(states, output) {
	return states[indexOfMax(output)];
}

setInterval(async () => {
	await Promise.all(cameras.map(async id => {
		const res = await axios({
			method: 'get',
			responseType: 'arraybuffer',
			url: `http://traffic.sandyspringsga.gov/CameraImage.ashx?cameraId=${id}`
		});

		// crop traffic light and pass to neural net
		image = await cropFromCenter(res.data, 122, 94, 16, 30);
		const outputs = net.update(await imageToInput(image));

		// map traffic light colors to neural net states
		const colors = {
			0: 'Green',
			1: 'Yellow',
			2: 'Red'
		};
		const color = getState(colors, outputs);

		// send traffic camera image, cropped light, and color to browser
		io.emit(`image-original-${id}`, res.data);
		io.emit(`image-${id}`, await util.promisify(image.getBuffer.bind(image))('image/jpeg'));
		io.emit(`color-${id}`, color);
	}));
}, 1000 / 2);
