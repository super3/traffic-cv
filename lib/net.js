const fs = require('fs');
const PolyNet = require('polynet');

const net = Object.assign(new PolyNet(), JSON.parse(fs.readFileSync(`${__dirname}/../net.json`, 'utf8')));

net.f = x => x / (1 + Math.abs(x));

module.exports = net;
