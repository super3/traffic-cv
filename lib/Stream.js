const EventEmitter = require('events');

module.exports = class Stream extends EventEmitter {
	constructor() {
		super();

		this._pipes = new Set();

		this.on('data', data => {
			for(const pipe of this._pipes)
				pipe.write(data);
		});
	}

	pipe(pipe) {
		this._pipes.add(pipe);
	}
};
