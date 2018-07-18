const fs = require('fs');
const PolyNet = require('polynet');

module.exports = Object.assign(new PolyNet(), JSON.parse(fs.readFileSync(`${__dirname}/../net.json`, "utf8")));
