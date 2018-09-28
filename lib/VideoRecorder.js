const Stream = require('./Stream');
const {spawn} = require('child_process');
const fs = require('mz/fs');

module.exports = class VideoRecorder extends Stream {
	constructor(directory, fps, clipLength) {
		super();

		this.directory = directory;
		this.fps = fps;
		this.clipLength = clipLength;

		this.counter = 0;
	}

	async write(img) {
		try {
			await fs.mkdir(this.directory);
		} catch(err) {

		}

		if(!this.ffmpeg) {
			this.ffmpeg = spawn('ffmpeg', [
				'-f',
				'image2pipe',
				'-r',
				this.fps,
				'-vcodec',
				'mjpeg',
				'-i',
				'-',
				'-vcodec',
				'libx264',
				`${this.directory}/${Date.now()}.mp4`
			]);
		}

		this.ffmpeg.stdin.write(img);

		if(++this.counter % (this.clipLength * this.fps) === 0) {
			this.ffmpeg.stdin.end();
			this.ffmpeg = undefined;
		}
	}
}
