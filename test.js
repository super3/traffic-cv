const assert = require('assert');
const fs = require('mz/fs');
const PolyNet = require('polynet');

const net = require('./lib/net');
const loadImage = require('./lib/loadImage');

function test(directory, highestOutput) {
	const images = fs.readdirSync(`${__dirname}/images/${directory}`);

	for (const filename of images) {
		it(`${directory} ${filename}`, async () => {
			const image = await loadImage(`${directory}/${filename}`);
			const output = net.update(image);

			assert.equal(output.indexOf(Math.max(...output)), highestOutput);
		});
	}
}

describe('Training Data', () => {
	describe('Green', () => {
		test('training/green', 0);
	});

	describe('Yellow', () => {
		test('training/yellow', 1);
	});

	describe('Red', () => {
		test('training/red', 2);
	});
});

describe('Testing Data', () => {
	describe('Green', () => {
		test('testing/green', 0);
	});

	describe('Yellow', () => {
		test('testing/yellow', 1);
	});

	describe('Red', () => {
		test('testing/red', 2);
	});
});
