# video-hash
[![npm](https://img.shields.io/npm/v/video-hash.svg?style=for-the-badge)](https://www.npmjs.com/package/video-hash)
[![npm](https://img.shields.io/npm/dt/video-hash.svg?style=for-the-badge)](https://www.npmjs.com/package/video-hash)
[![David](https://img.shields.io/david/KyleRoss/node-video-hash.svg?style=for-the-badge)](https://david-dm.org/KyleRoss/node-video-hash)
[![Travis](https://img.shields.io/travis/KyleRoss/node-video-hash/master.svg?style=for-the-badge)](https://travis-ci.org/KyleRoss/node-video-hash)
[![Coveralls](https://img.shields.io/coveralls/github/KyleRoss/node-video-hash.svg?style=for-the-badge)](https://coveralls.io/github/KyleRoss/node-video-hash)
[![license](https://img.shields.io/github/license/KyleRoss/node-video-hash.svg?style=for-the-badge)](https://github.com/KyleRoss/node-video-hash/blob/master/LICENSE)
[![Beerpay](https://img.shields.io/beerpay/KyleRoss/node-video-hash.svg?style=for-the-badge)](https://beerpay.io/KyleRoss/node-video-hash)

Algorithm to fingerprint videos with relatively high accuracy and returns a hash. Achieved by capturing screenshots at particular intervals, hashing the pixels
of each screenshot and creating a single hash from all of the generated pixel hashes. This package uses [FFmpeg](https://ffmpeg.org/) to take screenshots and 
[FFprobe](https://ffmpeg.org/ffprobe.html) to retrieve metadata. Please note that this package is going to be slow depending on the size of video you are 
fingerprinting.

# Usage
## Requirements
In order to use this package, you must have the following requirements met:

1. [FFmpeg](https://ffmpeg.org/) installed and in your PATH or a local binary.
    - You can use a package like [ffmpeg-installer](https://www.npmjs.com/package/@ffmpeg-installer/ffmpeg) to provide precompiled binaries for your OS.
2. [FFprobe](https://ffmpeg.org/ffprobe.html) installed and in your PATH or a local binary.
    - You can use a package like [ffprobe-installer](https://www.npmjs.com/package/@ffprobe-installer/ffprobe) to provide precompiled binaries for your OS.

## Install
```
npm install --save video-hash
```

## Quick Start
This example shows how to get started using precompiled binaries:

```bash
npm install --save video-hash @ffmpeg-installer/ffmpeg @ffprobe-installer/ffprobe
```

```js
const ffmpeg = require('@ffmpeg-installer/ffmpeg');
const ffprobe = require('@ffprobe-installer/ffprobe');

const vHash = require('video-hash')({
    ffmpegPath: ffmpeg.path,
    ffprobePath: ffprobe.path
});

async createFingerprint(videoPath) {
    const video = vHash.video(videoPath);
    
    try {
        let hash = await video.hash();
        return hash;
    } catch(err) {
        throw err;
    }
}
```

# API Documentation
<a name="module_video-hash"></a>

## video-hash

* [video-hash](#module_video-hash)
    * [VideoHash([options])](#exp_module_video-hash--VideoHash) ⇒ <code>this</code> ⏏
        * [.video(videoPath)](#module_video-hash--VideoHash+video) ⇒ [<code>Video</code>](#Video)
        * [.options](#module_video-hash--VideoHash.options) : <code>Object</code>

<a name="exp_module_video-hash--VideoHash"></a>

### VideoHash([options]) ⇒ <code>this</code> ⏏
Function exported from this module. Call with `options` object. May be called with or without `new`.

**Kind**: Exported function  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> | <code>{}</code> | Optional options to pass into the module. |
| [options.ffmpegPath] | <code>String</code> | <code></code> | Overrides the path to the `ffmpeg` binary. If not provided, it will attempt to locate on the system. |
| [options.ffprobePath] | <code>String</code> | <code></code> | Overrides the path to the `ffprobe` binary. If not provided, it will attempt to locate on the system. |
| [options.hashAlgorithm] | <code>String</code> | <code>&#x27;sha256&#x27;</code> | The hashing algorithm to use when generating the hash. Must be one of the                                                   available from [crypto.createHash](https://nodejs.org/api/crypto.html#crypto_crypto_createhash_algorithm_options). |
| [options.tempDir] | <code>String</code> | <code>os.tmpdir()</code> | Overrides the temp directory where various metadata during hashing is stored. |
| [options.hashBits] | <code>Number</code> | <code>12</code> | Hash length when generating hashes of screenshots. The longer the value, the more unique.                                        See [imghash.hash](https://github.com/pwlmaciejewski/imghash#hashfilepath-bits-format). |
| [options.strength] | <code>Number</code> | <code>2</code> | The strength of the generated video hash. Must be a number between 0.1 and 10. Determines the percentage in which                                       each screenshot is taken based on the video duration. Setting this option to a higher value will provide a stronger                                      fingerprint, but will take longer to generate the hash. |

**Example**  
```js
// Using default options:
const vHash = require('video-hash')();

// With options:
const vHash = require('video-hash')({
    // options...
});
```
<a name="module_video-hash--VideoHash+video"></a>

#### vHash.video(videoPath) ⇒ [<code>Video</code>](#Video)
Prepares a video for hashing at the provided `videoPath`. Returns a new instance of `Video`.

**Kind**: instance method of [<code>VideoHash</code>](#exp_module_video-hash--VideoHash)  
**Returns**: [<code>Video</code>](#Video) - New instance of `Video`.  
**Throws**:

- <code>Error</code> If `videoPath` is not provided.


| Param | Type | Description |
| --- | --- | --- |
| videoPath | <code>String</code> | Path to video file to load for hashing. |

**Example**  
```js
const video = vHash.video('/path/to/some-video.mp4');
// => Video { ... }
```
<a name="module_video-hash--VideoHash.options"></a>

#### vHash.options : <code>Object</code>
Compiled options object. All options except `ffmpegPath` and `ffprobePath` can be changed at any time.

**Kind**: static property of [<code>VideoHash</code>](#exp_module_video-hash--VideoHash)  
<a name="Video"></a>

## Video
**Kind**: global class  

* [Video](#Video)
    * [new Video(options, video)](#new_Video_new)
    * [video.hash()](#Video+hash) ⇒ <code>Promise.&lt;String&gt;</code>
    * [video.metadata()](#Video+metadata) ⇒ <code>Promise.&lt;Object&gt;</code>

<a name="new_Video_new"></a>

### new Video(options, video)
Creates an instance of Video. This constructor cannot be called directly.


| Param | Type | Description |
| --- | --- | --- |
| options | <code>Object</code> | Options passed from VideoHash. |
| video | <code>FfmpegCommand</code> | Instance of `FfmpegCommand` from `fluent-ffmpeg` for the video. |

<a name="Video+hash"></a>

### video.hash() ⇒ <code>Promise.&lt;String&gt;</code>
Generates the hash/fingerprint for a single video.

**Kind**: instance method of [<code>Video</code>](#Video)  
**Returns**: <code>Promise.&lt;String&gt;</code> - The generated hash/fingerprint for the video.  
**Example**  
```js
const vHash = require('video-hash')({
    // options...
});

async function hashVideo(videoPath) {
    const video = vHash.video(videoPath);

    try {
        let hash = await video.hash();
        return hash;
    } catch(err) {
        throw err;
    }
```
<a name="Video+metadata"></a>

### video.metadata() ⇒ <code>Promise.&lt;Object&gt;</code>
Returns basic metadata for a single video from `ffprobe`.

**Kind**: instance method of [<code>Video</code>](#Video)  
**Returns**: <code>Promise.&lt;Object&gt;</code> - The `format` metadata object for the video. See [metadata](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg#reading-video-metadata).  
**Example**  
```js
async function getMetadata(videoPath) {
    const video = vHash.video(videoPath);
    let metadata = await video.metadata();
}
```
---

## Algorithm
Video Hash uses a basic algorithm to generate a hash for a video that will provide consistent results each time for the same provided options. This works 
by taking captures at percentage-based intervals based off of the duration of the video. The module generates a number of captures to take from the video 
using an equation like:

```
⌈(⌈duration⌉ * strength)⌉
```

To simplify, the video duration is rounded up to the nearest whole number and multiplied by the provided `strength` option. The resulting number is then rounded 
up to the nearest whole number. From there, the dependency `fluent-ffmpeg` will generate an array of percentages based on the duration of the video for when 
FFmpeg shoud capture a screenshot. If the duration of the video does not change, neither will the hash.

After all of the captures are taken by FFmpeg, each one is hashed using [perceptual hashing](https://en.wikipedia.org/wiki/Perceptual_hashing) and stored. Once 
the hashes are generated, all are combined and a final hash (SHA256 by default) is generated and returned.

## Tests
To run tests locally, ensure you have all of the requirements installed and run:

```
npm test
```

## Contributing
When contributing to this package, please follow the guidelines below:

1. Ensure the there are no ESLint errors in the code, following the `.eslintrc.yml` file in the repo.
2. Write or update tests for any changes. I strive for 100% coverage, but 95% or higher is acceptable.
3. Run the tests locally and ensure they pass.
4. Commits must use the [conventional commits spec](https://www.conventionalcommits.org/en/v1.0.0-beta.3/#specification). If you do not, your commit will fail.
5. Submit a pull request.

## License
MIT License
