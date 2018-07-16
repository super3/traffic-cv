const fs = require('fs');
const axios = require('axios');
const util = require('util');

const cameras = [
	43
];

setInterval(async () => {
	await Promise.all(cameras.map(async id => {
		const res = await axios({
			method: 'get',
			responseType: 'stream',
			url: `http://traffic.sandyspringsga.gov/CameraImage.ashx?cameraId=${id}`
		});

		res.data.pipe(fs.createWriteStream(`images/${id}-${Date.now()}.jpeg`));
	}));
}, 1000 / 5);
