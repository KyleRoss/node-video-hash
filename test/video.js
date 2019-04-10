"use strict";
const assert = require('assert');
const VideoHash = require('../');
const Video = require('../lib/Video');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');
const os = require('os');

const assets = path.join(__dirname, 'assets');

describe('Video', () => {
    describe('Constructor', () => {
        let video = new Video({ test: true }, ffmpeg('/path/to/video.mp4'));
        
        it('should set _opts property', () => {
            assert.equal(video._opts.test, true);
        });
        
        it('should set ffmpeg instance as _video', () => {
            assert(video._video instanceof ffmpeg);
        });
    });
    
    describe('Methods', () => {
        describe('_calcScreenshotCount()', () => {
            let video = new Video(VideoHash.defaults);
            
            it('should return a number', () => {
                assert(typeof video._calcScreenshotCount(10, 2) === 'number');
            });
            
            it('should calculate the screenshot correctly based on inputted parameters', () => {
                assert.equal(video._calcScreenshotCount(10, 2), 20);
                assert.equal(video._calcScreenshotCount(10.55, 2), 22);
                assert.equal(video._calcScreenshotCount(5, 5), 25);
                assert.equal(video._calcScreenshotCount(0.156, 2), 2);
            });
        });
        
        describe('_getTempDirPath()', () => {
            let video = new Video(VideoHash.defaults);
            
            it('should return a string path', async () => {
                let res = await video._getTempDirPath(os.tmpdir());
                assert(typeof res === 'string');
            });
            
            it('should create a temp path', async () => {
                let res = await video._getTempDirPath(os.tmpdir());
                assert(typeof res === 'string');
                
                fs.accessSync(res);
            });
            
            it('should format the new directory correctly', async () => {
                let res = await video._getTempDirPath(os.tmpdir());
                assert(res.includes(os.tmpdir()));
                assert(res.match(/vhash_[\d+]/) !== null);
            });
        });
        
        describe('_generateCaptureHashes()', function() {
            this.timeout(5000);
            let video = new Video(VideoHash.defaults);
            
            it('should return a promise', () => {
                let res = video._generateCaptureHashes([]);
                assert(res instanceof Promise);
            });
            
            it('should return a promise', () => {
                let res = video._generateCaptureHashes([]);
                assert(res instanceof Promise);
            });
            
            it('should resolve with image hashes', async () => {
                let res = await video._generateCaptureHashes([
                    path.join(assets, 'test-image-1.jpg'),
                    path.join(assets, 'test-image-2.jpg')
                ]);
                
                assert(Array.isArray(res));
                assert(res.length === 2);
                assert(res[0] !== res[1]);
            });
        });
        
        describe('_captureScreenshots()', function() {
            this.timeout(60000);
            let video = new Video(VideoHash.defaults, ffmpeg(path.join(assets, 'test-video-1.mp4')));
            
            it('should return array of file paths for screenshots', async () => {
                video._video._forgetPaths();
                let res = await video._captureScreenshots({
                    duration: 17
                });
                
                assert(Array.isArray(res));
                assert.equal(res.length, 34);
            });
        });
        
        describe('metadata()', function() {
            describe('without a video set', () => {
                let video = new Video(VideoHash.defaults);
                
                it('should throw an error', (done) => {
                    video.metadata().then(() => {
                        done(new Error('Did not throw an error!'));
                    }).catch(e => {
                        if(e instanceof Error && e.message === 'Video was not provided.') return done();
                        done(new Error('Did not throw the correct error'));
                    });
                });
            });
            
            describe('with a video set', () => {
                this.timeout(30000);
                let video = new Video(VideoHash.defaults, ffmpeg(path.join(assets, 'test-video-1.mp4'))),
                    promise,
                    meta;
                
                before(async () => {
                    promise = video.metadata();
                    meta = await promise;
                });
                
                it('should return a promise', () => {
                    assert(promise instanceof Promise);
                });
                
                it('should resolve with a metadata object', () => {
                    assert.equal(typeof meta, 'object');
                });
                
                it('should cache the metadata', () => {
                    assert.equal(video._video._vhashMeta, meta);
                });
                
                it('should returned cached metadata on subseqent calls', async function() {
                    this.timeout(1000);
                    let res = await video.metadata();
                    assert.equal(res, video._video._vhashMeta);
                });
                
                it('should throw an error when an invalid video is provided', function(done) {
                    this.timeout(5000);
                    let video = new Video(VideoHash.defaults, ffmpeg('does-not-exist'));
                    
                    video.metadata().then(() => {
                        done(new Error('Did not fail!'));
                    }).catch(() => {
                        done();
                    });
                });
            });
        });
        
        describe('hash()', () => {
            describe ('without a video set', () => {
                let video = new Video(VideoHash.defaults);
                
                it('should throw an error', (done) => {
                    video.hash().then(() => {
                        done(new Error('Did not throw an error!'));
                    }).catch(e => {
                        if(e instanceof Error && e.message === 'Video was not provided.') return done();
                        done(new Error('Did not throw the correct error'));
                    });
                });
            });
            
            describe ('with a video set', function() {
                this.timeout(120000);
                let video = new Video(VideoHash.defaults, ffmpeg(path.join(assets, 'test-video-1.mp4'))),
                    promise,
                    hash1, hash2;
                
                before(async () => {
                    promise = video.hash();
                    hash1 = await promise;
                    hash2 = await new Video(VideoHash.defaults, ffmpeg(path.join(assets, 'test-video-2.mp4'))).hash();
                });
                
                it('should return a promise', () => {
                    assert(promise instanceof Promise);
                });
                
                it('should resolve with a hash', () => {
                    assert.equal(typeof hash1, 'string');
                    assert.equal(typeof hash2, 'string');
                });
                
                it('should create different hashes for different videos', () => {
                    assert.notEqual(hash1, hash2);
                });
            });
        });
    });
});
