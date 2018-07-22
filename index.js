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
	const binaryImage = await util.promisify(img.getBuffer.bind(img))('image/jpeg');
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

		async function getTrafficLightState(img, x, y, lightId) {
			// crop traffic light and pass to neural net
			const image = await cropFromCenter(img, x, y, 16, 30);
			const outputs = net.update(await imageToInput(image));

			// map traffic light colors to neural net states
			const colors = {
				0: 'Green',
				1: 'Yellow',
				2: 'Red'
			};

			io.emit(`image-${id}-${lightId}`, await util.promisify(image.getBuffer.bind(image))('image/jpeg'))

			// return traffic light color
			return getState(colors, outputs) + ' ' + JSON.stringify(outputs.map(x => Math.round(x * 100)));
		}

		io.emit(`color-${id}`, await getTrafficLightState(res.data, 50, 92, 1) + ' ' + await getTrafficLightState(res.data, 122, 94, 2));

		//image = await cropFromCenter(res.data, 122, 94, 16, 30);
		// send traffic camera image, cropped light, and color to browser
		io.emit(`image-${id}`, res.data);

	}));
}, 1000 / 2);
