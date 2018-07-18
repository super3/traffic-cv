const assert = require('assert');
const fs = require('mz/fs');
const PolyNet = require('polynet');

const loadImage = require('./lib/loadImage');

const net = Object.assign(new PolyNet(), JSON.parse(fs.readFileSync(`${__dirname}/net.json`, "utf8")));

function test(directory, highestOutput) {
	const images = fs.readdirSync(`${__dirname}/images/${directory}`);

	for(const filename of images) {
		it(`${directory} ${filename}`, async () => {
			const image = await loadImage(`${directory}/${filename}`);
			const output = net.update(image);

			assert.equal(output.indexOf(Math.max(...output)), highestOutput);
		});
	}
}

describe('Net', () => {
	describe('Green', () => {
		test('green', 0);
		test('testing/green', 0);
	});

	describe('Yellow', () => {
		test('yellow', 1);
		test('testing/yellow', 1);
	});

	describe('Red', () => {
		test('red', 2);
		test('testing/red', 2);
	});
});
