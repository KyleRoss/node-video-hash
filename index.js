"use strict";
/**
 * @module video-hash
 */

const ffmpeg = require('fluent-ffmpeg');
const os = require('os');

const Video = require('./lib/Video');

/**
 * Function exported from this module. Call with `options` object. May be called with or without `new`.
 * @alias module:video-hash
 * @typicalname vHash
 * @param {Object} [options={}] Optional options to pass into the module.
 * @param {String} [options.ffmpegPath=null] Overrides the path to the `ffmpeg` binary. If not provided, it will attempt to locate on the system.
 * @param {String} [options.ffprobePath=null] Overrides the path to the `ffprobe` binary. If not provided, it will attempt to locate on the system.
 * @param {String} [options.hashAlgorithm='sha256'] The hashing algorithm to use when generating the hash. Must be one of the 
 *                                                  available from [crypto.createHash](https://nodejs.org/api/crypto.html#crypto_crypto_createhash_algorithm_options).
 * @param {String} [options.tempDir=os.tmpdir()] Overrides the temp directory where various metadata during hashing is stored.
 * @param {Number} [options.hashBits=12] Hash length when generating hashes of screenshots. The longer the value, the more unique. 
 *                                       See [imghash.hash](https://github.com/pwlmaciejewski/imghash#hashfilepath-bits-format).
 * @param {Number} [options.strength=2] The strength of the generated video hash. Must be a number between 0.1 and 10. Determines the percentage in which 
 *                                      each screenshot is taken based on the video duration. Setting this option to a higher value will provide a stronger
 *                                      fingerprint, but will take longer to generate the hash.
 * @returns {this} 
 * 
 * @example
 * // Using default options:
 * const vHash = require('video-hash')();
 * 
 * // With options:
 * const vHash = require('video-hash')({
 *     // options...
 * });
 */
function VideoHash(options) {
    if(!(this instanceof VideoHash)) return new VideoHash(options);
    
    let _options = Object.assign({}, VideoHash.defaults, options);
    
    /**
     * Compiled options object. All options except `ffmpegPath` and `ffprobePath` can be changed at any time.
     * @type {Object}
     */
    this.options = _options;
    
    this._ffmpeg = ffmpeg;
    
    if(_options.ffmpegPath) ffmpeg.setFfmpegPath(_options.ffmpegPath);
    if(_options.ffprobePath) ffmpeg.setFfprobePath(_options.ffprobePath);
}

/**
 * Prepares a video for hashing at the provided `videoPath`. Returns a new instance of `Video`.
 * @param {String} videoPath Path to video file to load for hashing.
 * @returns {Video} New instance of `Video`.
 * @throws {Error} If `videoPath` is not provided.
 * 
 * @example 
 * const video = vHash.video('/path/to/some-video.mp4');
 * // => Video { ... }
 */
VideoHash.prototype.video = function video(videoPath) {
    if(!videoPath) throw new Error('You must provide a path to a video.');
    let video = ffmpeg(videoPath);
    return new Video(this.options, video);
};

VideoHash.defaults = {
    ffmpegPath: null,
    ffprobePath: null,
    hashAlgorithm: 'sha256',
    tempDir: os.tmpdir(),
    hashBits: 12,
    strength: 2
};

module.exports = VideoHash;
