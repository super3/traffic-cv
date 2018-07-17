const fs = require('fs');
const util = require('util');
const Jimp = require('jimp');
const PolyNet = require('polynet');

const loadImage = require('./lib/loadImage');

(async () => {
	const imagePaths = fs.readdirSync(`${__dirname}/images/`);

	imagePaths.sort();

	const images = [
		...fs.readdirSync(`${__dirname}/images/green`).map(path => ({
			path: `green/${path}`,
			outputs: [ 1, 0, 0 ]
		})),
		/*...imagePaths.slice(0, 21).map(path => ({
			path,
			outputs: [ 0, 1, 0 ]
		})),*/
		...fs.readdirSync(`${__dirname}/images/red`).map(path => ({
			path: `red/${path}`,
			outputs: [ 0, 0, 1 ]
		}))
	];

	const trainingSet = await Promise.all(images.map(async obj => {
		return [
			await loadImage(obj.path),
			obj.outputs
		];
	}));

	const net = new PolyNet(trainingSet[0][0].length, 3, 3);

	net.f = x => x / (1 + Math.abs(x));

	net.train(trainingSet, {
		iterations: 1000
	});

	fs.writeFileSync(`${__dirname}/net.json`, JSON.stringify(net));
})();
