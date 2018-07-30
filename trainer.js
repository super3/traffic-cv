const fs = require('fs');
const util = require('util');
const Jimp = require('jimp');

const PolyNet = (() => {
	let PolyNet;

	try {
		PolyNet = require('../polynet');
		console.log('Using local development PolyNet');
	} catch(error) {
		console.log('Using node_modules production PolyNet');
		PolyNet = require('polynet');
	}

	return PolyNet;
})();

const PolyNetNative = (() => {
	let PolyNetNative;

	try {
		PolyNetNative = require('../polynet-native');
	} catch(error) {
		try {
			PolyNetNative = require('../native-trainer');
		} catch(error) {
			PolyNetNative = require('polynet');
		}
	}

	return PolyNetNative;
})();

const loadImage = require('./lib/loadImage');

(async () => {
	const images = [
		...fs.readdirSync(`${__dirname}/images/training/green`).map(path => ({
			path: `training/green/${path}`,
			outputs: [1, 0, 0]
		})),
		...fs.readdirSync(`${__dirname}/images/training/yellow`).map(path => ({
			path: `training/yellow/${path}`,
			outputs: [0, 1, 0]
		})),
		...fs.readdirSync(`${__dirname}/images/training/red`).map(path => ({
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

	const startTime = Date.now();

	const trainingConfig = {
		iterations: 20,
		incr: 0.05
	};

	const layers = await PolyNetNative.trainNew([ trainingSet[0][0].length, 6, 3 ], trainingSet, {
		step: 0.2,
		iterations: 5
	});

	const net = new PolyNet(...layers);
	net.f = x => x / (1 + Math.abs(x));

	console.log(net.update(trainingSet[0][0]));

	console.log(`Training took ${Date.now() - startTime}ms.`);

	// fs.writeFileSync(`${__dirname}/net.json`, JSON.stringify(net));
})();
