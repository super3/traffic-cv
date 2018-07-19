const fs = require('fs');
const axios = require('axios');
const io = require('socket.io')(3052);
const Jimp = require('jimp');
const util = require('util');
const PImage = require('pureimage');
const EventEmitter = require('events');

const net = require('./lib/net');

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

		const stream = new EventEmitter();

		const originalPromise = PImage.decodeJPEGFromStream(stream);

		stream.emit('data', res.data);
		stream.emit('end');

		const original = await originalPromise;

		const ctx = original.getContext('2d');

		ctx.fillStyle = '#00ff00';
		ctx.beginPath();
		ctx.arc(50,50,40,0,Math.PI*2,true); // Outer circle
		ctx.closePath();
		ctx.fill();

	 	let newImage = Buffer.alloc(0);

		await new Promise(resolve => {
			const outputStream = {
				write(buf) {
					newImage = Buffer.concat([
						newImage,
						buf
					])
				},
				end() {
					resolve(newImage);
				},
				on() {
					
				}
			};

			PImage.encodeJPEGToStream(original, outputStream);
		});


		let image = await Jimp.read(res.data);
		image = await image.crop(122 - 8, 94 - 15, 16, 30);

		const lightBuffer = await util.promisify(image.getBuffer.bind(image))('image/jpeg');

		const output = net.update([...(await Jimp.read(lightBuffer)).bitmap.data].map(x => x / 256));

		const colors = {
			0: 'Green',
			1: 'Yellow',
			2: 'Red'
		};

		const color = colors[output.indexOf(Math.max(...output))];

		io.emit(`image-original-${id}`, newImage);
		io.emit(`image-${id}`, await util.promisify(image.getBuffer.bind(image))('image/jpeg'));
		io.emit(`color-${id}`, color);
	}));
}, 1000 / 2);
