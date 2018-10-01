const util = require('util');
const io = require('socket.io')(3052);

const Jimp = require('jimp');

const Camera = require('./lib/Camera');
const VideoRecorder = require('./lib/VideoRecorder');
const Cropper = require('./lib/Cropper');
const NetStreamer = require('./lib/NetStreamer');
const NetParser = require('./lib/NetParser');

const net = require('./lib/net');

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

const fps = 0.5;

function setColor(image, x, y, color) {
	const index = image.getPixelIndex(x, y);

	image.bitmap.data[index] = color[0];
	image.bitmap.data[index + 1] = color[1];
	image.bitmap.data[index + 2] = color[2];
}

function drawHorizontalLine(image, x, y, length, color, thickness = 2) {
	for(let i = 0 - thickness; i < length + thickness; i++) {
		for(let j = 0 - thickness; j < thickness; j++) {
			setColor(image, x + i, y + j, color);
		}
	}
}

function drawVerticalLine(image, x, y, length, color, thickness = 2) {
	for(let i = 0 - thickness; i < length + thickness; i++) {
		for(let j = 0 - thickness; j < thickness; j++) {
				setColor(image, x + j, y + i, color);
		}
	}
}

function drawBox(image, x, y, width, height, color, thickness = 2) {
	drawHorizontalLine(image, x, y, width, color);
	drawHorizontalLine(image, x, y + height, width, color);
	drawVerticalLine(image, x, y, height, color);
	drawVerticalLine(image, x + width, y, height, color);
}

for(const { id, lights } of cameras) {
	const camera = new Camera(id, fps);

	const recorder = new VideoRecorder(`${__dirname}/images/capture/${id}`, fps, 1);
	camera.pipe(recorder);

	camera.on('data', async data => {
		const image = await Jimp.read(data);

		for(const light of lights) {
			drawBox(image, light.x - 8, light.y - 15, 16, 30, [0,0,0]);
		}

		io.emit(`image-${id}`, await util.promisify(image.getBuffer.bind(image))('image/jpeg'));
	});

	for(const light of lights) {
		const cropper = new Cropper(light.x, light.y, 16, 30);
		camera.pipe(cropper);

		cropper.on('data', async image => {
			const buffer = await util.promisify(image.getBuffer.bind(image))('image/jpeg');

			io.emit(`image-${id}-${light.id}`, buffer);
		});

		const netStreamer = new NetStreamer(net);
		cropper.pipe(netStreamer);

		const netParser = new NetParser();
		netStreamer.pipe(netParser);

		netParser.on('data', color => {
			io.emit(`color-${id}-${lights.indexOf(light)}`, color);
		});
	}
}
