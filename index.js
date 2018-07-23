const fs = require('fs');
const axios = require('axios');
const io = require('socket.io')(3052);
const Jimp = require('jimp');
const util = require('util');

const net = require('./lib/net');

const cropFromCenter = require('./lib/cropFromCenter');
const getState = require('./lib/getState');
const imageToInput = require('./lib/imagetoInput');

const cameras = [
	38
];

io.on('connection', socket => {
	socket.emit('cameras', cameras);
});


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

			// send images to browser
			io.emit(`image-${id}-${lightId}`, await util.promisify(image.getBuffer.bind(image))('image/jpeg'))

			// return traffic light color
			return getState(colors, outputs) + ' ' + JSON.stringify(outputs.map(x => Math.round(x * 100)));
		}

		// send colors to browser
		io.emit(`color-${id}`, await getTrafficLightState(res.data, 50, 92, 1) + ' ' + await getTrafficLightState(res.data, 122, 94, 2));

		// send traffic camera image
		io.emit(`image-${id}`, res.data);

	}));
}, 1000 / 2);
