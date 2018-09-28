const Stream = require('./Stream');
const axios = require('axios');

module.exports = class Camera extends Stream {
	constructor(id, fps) {
		super();

		const url = !process.env.FAKE_URL ?  `http://traffic.sandyspringsga.gov/CameraImage.ashx?cameraId=${id}` : 'https://avatars0.githubusercontent.com/u/3048503?v=4';

		setInterval(async () => {
			const { data } = await axios({
				method: 'get',
				responseType: 'arraybuffer',
				url
			});

			console.log(typeof data);

			this.emit('data', data);
		}, 1000 / fps);
	}
};
