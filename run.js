const fs = require('fs');

const net = require('./lib/net');
const loadImage = require('./lib/loadImage');

(async () => {
	const input = await loadImage(process.argv[2], false);

	const output = net.update(input);

	const max = Math.max(...output);
	const maxIndex = output.indexOf(max);

	const colors = {
		'0': 'green',
		'1': 'yellow',
		'2': 'red'
	};

	console.log(output);
	console.log(`Traffic lights are '${colors[maxIndex]}' with a ${(max * 100).toFixed(2)}% probability.`);
})();
