const fs = require('fs');
const PolyNet = require('polynet');

const loadImage = require('./lib/loadImage');

(async () => {
	const net = Object.assign(new PolyNet(), JSON.parse(fs.readFileSync(`${__dirname}/net.json`, "utf8")));

	// net.f = x => x / (1 + Math.abs(x));

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
