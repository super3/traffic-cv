const indexOfMax = require('./indexOfMax');

module.exports = function getState(states, output) {
	return states[indexOfMax(output)];
};
