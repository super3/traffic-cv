const fs = require('mz/fs');
const axios = require('axios');
const io = require('socket.io')(3052);
const Jimp = require('jimp');
const util = require('util');

const net = require('./lib/net');
const cropFromCenter = require('./lib/cropFromCenter');
const getState = require('./lib/getState');
const imageToInput = require('./lib/imageToInput');

const cameras = [
	{
		id: 38,
		lights: [
			{
				x: 179,
				y: 95
			},
			{
				x: 256,
				y: 99
			}
		]
	},
	{
		id: 43,
		lights: [
			{
				x: 176,
				y: 62
			},
			{
				x: 218,
				y: 63
			}
		]
	}
];

io.on('connection', socket => {
	socket.emit('cameras', cameras);
});

setInterval(async () => {
	await Promise.all(cameras.map(async ({ id, lights }) => {
		const res = await axios({
			method: 'get',
			responseType: 'arraybuffer',
			url: `http://traffic.sandyspringsga.gov/CameraImage.ashx?cameraId=${id}`
		});

		async function writeCameraData(img, id) {
			try {
				await fs.mkdir(`${__dirname}/images/capture/${id}/`);
			}
			catch(e) {
				// already created
			}
			await fs.writeFile(`${__dirname}/images/capture/${id}/${id}-${Date.now()}.jpeg`, img);
		}

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
			const buffer = await util.promisify(image.getBuffer.bind(image))('image/jpeg');
			io.emit(`image-${id}-${lightId}`, buffer);

			// optional capture command
			if(process.argv.includes('--capture-lights')) {
				try {
					await fs.mkdir(`${__dirname}/images/capture/lights/`);
				}
				catch(e) {
					// already created
				}
				await fs.writeFile(`${__dirname}/images/capture/lights/${id}-${lightId}-${Date.now()}.jpeg`, buffer);
			}

			// return traffic light color
			return getState(colors, outputs) + ' ' + JSON.stringify(outputs.map(x => Math.round(x * 100)));
		}

		// send colors to browser
		for(const light of lights) {
			io.emit(`color-${id}-${lights.indexOf(light)}`,
				await getTrafficLightState(res.data, light.x, light.y, lights.indexOf(light)));

			if(process.argv.includes('--capture-scene'))
				await writeCameraData(res.data, id)
		}

		// send traffic camera image
		io.emit(`image-${id}`, res.data);

	}));
}, 1000 / 2);
