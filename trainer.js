const fs = require('fs');
const util = require('util');
const Jimp = require('jimp');
const PolyNet = require('polynet');

const loadImage = require('./lib/loadImage');

(async () => {
	const images = [
		...fs.readdirSync(`${__dirname}/images/traning/green`).map(path => ({
			path: `training/green/${path}`,
			outputs: [1, 0, 0]
		})),
		...fs.readdirSync(`${__dirname}/images/traning/yellow`).map(path => ({
			path: `training/yellow/${path}`,
			outputs: [0, 1, 0]
		})),
		...fs.readdirSync(`${__dirname}/images/traning/red`).map(path => ({
			path: `training/red/${path}`,
			outputs: [0, 0, 1]
		}))
	];

	const trainingSet = await Promise.all(images.map(async obj => {
		return [
			await loadImage(obj.path),
			obj.outputs
		];
	}));

	const net = new PolyNet(trainingSet[0][0].length, 6, 3);

	net.f = x => x / (1 + Math.abs(x));

	net.train(trainingSet, {
		iterations: 20,
		incr: 0.05
	});

	fs.writeFileSync(`${__dirname}/net.json`, JSON.stringify(net));
})();
