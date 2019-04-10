"use strict";
const assert = require('assert');
const ffmpeg = require('fluent-ffmpeg');
const os = require('os');

const VideoHash = require('../');
const Video = require('../lib/Video');

describe('Module', () => {
    it('should return a function', () => {
        assert(typeof VideoHash === 'function');
    });
    
    it('should create a new instance when called', () => {
        let vHash = VideoHash();
        assert(vHash instanceof VideoHash);
    });
    
    describe('Instance', () => {
        it('should set the default options', () => {
            let vHash = new VideoHash();
            
            assert.equal(vHash.options.ffmpegPath, null);
            assert.equal(vHash.options.ffprobePath, null);
            assert.equal(vHash.options.hashAlgorithm, 'sha256');
            assert.equal(vHash.options.tempDir, os.tmpdir());
            assert.equal(vHash.options.hashBits, 12);
            assert.equal(vHash.options.strength, 2);
        });
        
        it ('should override default options', () => {
            let vHash = VideoHash({
                ffmpegPath: '/path/to/ffmpeg',
                ffprobePath: '/path/to/ffprobe',
                hashAlgorithm: 'sha512',
                tempDir: '/path/to/tmp',
                hashBits: 8,
                strength: 5
            });
            
            assert.equal(vHash.options.ffmpegPath, '/path/to/ffmpeg');
            assert.equal(vHash.options.ffprobePath, '/path/to/ffprobe');
            assert.equal(vHash.options.hashAlgorithm, 'sha512');
            assert.equal(vHash.options.tempDir, '/path/to/tmp');
            assert.equal(vHash.options.hashBits, 8);
            assert.equal(vHash.options.strength, 5);
        });
        
        describe ('FFmpeg/FFprobe Paths', () => {
            let vHash = VideoHash({
                ffmpegPath: '/path/to/ffmpeg',
                ffprobePath: '/path/to/ffprobe'
            });
            
            it('should set the ffmpeg path from options', (done) => {
                vHash._ffmpeg('/path/to/video.mp4')._getFfmpegPath(function(err, ffPath) {
                    assert(!err);
                    assert.equal(ffPath, '/path/to/ffmpeg');
                    done();
                });
            });
            
            it('should set the ffprobe path from options', (done) => {
                vHash._ffmpeg('/path/to/video.mp4')._getFfprobePath(function(err, ffPath) {
                    assert(!err);
                    assert.equal(ffPath, '/path/to/ffprobe');
                    done();
                });
            });
        });
    });
    
    describe('Methods', () => {
        describe('video()', () => {
            let vHash = VideoHash();
            
            it('should have a video method', () => {
                assert.equal(typeof vHash.video, 'function');
            });
            
            it('should return a new instance of Video when function is called', () => {
                let res = vHash.video('/path/to/video.mp4');
                assert(res instanceof Video);
            });
            
            it('should pass through options to Video', () => {
                let res = vHash.video('/path/to/video.mp4');
                assert.deepStrictEqual(res._opts, vHash.options);
            });
            
            it('should pass ffmpeg instance to Video', () => {
                let res = vHash.video('/path/to/video.mp4');
                assert(res._video);
                assert(res._video instanceof ffmpeg);
            });
            
            it('should throw an error without a path provided', () => {
                assert.throws(function() {
                    vHash.video();
                });
            });
        });
    });
});
