const util = require('util');
const io = require('socket.io')(3052);

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

for(const { id, lights } of cameras) {
	const camera = new Camera(id, fps);

	const recorder = new VideoRecorder(`${__dirname}/images/capture/${id}`, fps, 1);
	camera.pipe(recorder);

	camera.on('data', data => {
		io.emit(`image-${id}`, data);
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
			console.log(color);
		});
	}
}
