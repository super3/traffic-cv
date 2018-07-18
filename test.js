const assert = require('assert');
const fs = require('mz/fs');
const PolyNet = require('polynet');

const loadImage = require('./lib/loadImage');

const net = Object.assign(new PolyNet(), JSON.parse(fs.readFileSync(`${__dirname}/net.json`, "utf8")));

describe('Net', () => {
	describe('Green', () => {
		const images = fs.readdirSync(`${__dirname}/images/green`);

		for(const filename of images) {
			it(`${filename}`, async () => {
				const image = await loadImage(`green/${filename}`);
				const output = net.update(image);

				assert.equal(output.indexOf(Math.max(...output)), 0);
			});
		}
	});

	describe('Yellow', () => {
		const images = fs.readdirSync(`${__dirname}/images/yellow`);

		for(const filename of images) {
			it(`${filename}`, async () => {
				const image = await loadImage(`yellow/${filename}`);
				const output = net.update(image);

				assert.equal(output.indexOf(Math.max(...output)), 1);
			});
		}
	});

	describe('Red', () => {
		const images = fs.readdirSync(`${__dirname}/images/red`);

		for(const filename of images) {
			it(`${filename}`, async () => {
				const image = await loadImage(`red/${filename}`);
				const output = net.update(image);

				assert.equal(output.indexOf(Math.max(...output)), 2);
			});
		}
	});
});
