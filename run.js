const fs = require('fs');
const PolyNet = require('polynet');

const loadImage = require('./lib/loadImage');

(async () => {
	const net = Object.assign(new PolyNet(), JSON.parse(fs.readFileSync(`${__dirname}/net.json`, "utf8")));

	net.f = x => x / (1 + Math.abs(x));

	const input = await loadImage(process.argv[2], false);

	const output = net.update(input);

	const maxIndex = output.indexOf(Math.max(...output));

	const probability = Math.max(...output) / (output[0] + output[1] + output[2]) * 100;

	const colors = {
		'0': 'green',
		'1': 'amber',
		'2': 'red'
	};

	console.log(`Traffic lights are '${colors[maxIndex]}' with a ${probability.toFixed(2)}% probability.`);
})();
