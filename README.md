# Traffic CV
Toolset for determining physical state from traffic cameras.

[![Build Status](https://travis-ci.org/super3/traffic-cv.svg?branch=master)](https://travis-ci.org/super3/traffic-cv)
[![Coverage Status](https://coveralls.io/repos/github/super3/traffic-cv/badge.svg?branch=master)](https://coveralls.io/github/super3/traffic-cv?branch=master)
[![License](https://img.shields.io/badge/license-AGPLv3-blue.svg?label=license)](https://github.com/Storj/super3/traffic-cv/blob/master/LICENSE)
[![GitHub contributors](https://img.shields.io/github/contributors/super3/traffic-cv.svg)](https://github.com/super3/traffic-cv/graphs/contributors)
[![dependencies Status](https://david-dm.org/super3/traffic-cv/status.svg)](https://david-dm.org/super3/traffic-cv)
[![devDependencies Status](https://david-dm.org/super3/traffic-cv/dev-status.svg)](https://david-dm.org/super3/traffic-cv?type=dev)

### Demo
![demo.gif](demo.gif)

### Run Traffic Light Demo
```
node index.js
````
Then open up ```index.html``` in your browser.

### Train Traffic Light Neural Net
```
node train.js
```

### Test Neural Net with a Specific Image
```
node run.js [path_to_image]
```
Example:
```
node run.js images/38-1531834988419.jpeg
[ 0.01618855582872857, -0.00072788746163907, 0.46764020897403424 ]
Traffic lights are 'red' with a 46.76% probability.
```

### Capture Training/Testing Data
```
node capture.js
```
