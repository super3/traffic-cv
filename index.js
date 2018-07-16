const fs = require('fs');
const axios = require('axios');
const io = require('socket.io')(3052);

const cameras = [
	43
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

		io.emit(`image-${id}`, res.data);
	}));
}, 1000 / 5);
