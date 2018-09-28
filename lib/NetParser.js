const Stream = require('./Stream');
const indexOfMax = require('./indexOfMax');

module.exports = class NetParser extends Stream {
	constructor() {
		super();
	}

	write(outputs) {
		const colors = {
			0: 'Green',
			1: 'Yellow',
			2: 'Red'
		};

		this.emit('data', colors[indexOfMax(outputs)]);
	}
};
