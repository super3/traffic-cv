const Stream = require('./Stream');
const imageToInput = require('./imageToInput');

module.exports = class NetStreamer extends Stream {
	constructor(net) {
		super();

		this.net = net;
	}

	async write(image) {
		this.emit('data', this.net.update(await imageToInput(image)));
	}
}
