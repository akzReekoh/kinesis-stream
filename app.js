'use strict';

var platform = require('./platform');

/**
 * Emitted when the platform shuts down the plugin. The Stream should perform cleanup of the resources on this event.
 */
platform.once('close', function () {
	let d = require('domain').create();

	d.once('error', function (error) {
		console.error(error);
		platform.handleException(error);
		platform.notifyClose();
		d.exit();
	});

	d.run(function () {
		// TODO: Release all resources and close connections etc.
		platform.notifyClose(); // Notify the platform that resources have been released.
		d.exit();
	});
});

/**
 * Emitted when the platform bootstraps the plugin. The plugin should listen once and execute its init process.
 * Afterwards, platform.notifyReady() should be called to notify the platform that the init process is done.
 * @param {object} options The parameters or options. Specified through config.json.
 */
platform.once('ready', function (options) {
	let Transform = require('stream').Transform;
	let kinesis = require('kinesis');
	let bufferify = new Transform({objectMode: true});
	let kinesisSource = kinesis.stream({
		name: options.stream_name,
		region: options.region,
		credentials: {
			accessKeyId: options.access_key_id,
			secretAccessKey: options.secret_access_key
		}
	});

	bufferify._transform = function(record, encoding, cb) {
		let data = JSON.parse(record.Data);
		platform.requestDeviceInfo(data.device, function (error, requestId) {
			platform.once(requestId, function (deviceInfo) {
				if (deviceInfo) {
					platform.processData(data.device, JSON.stringify(data));
				} else {
					platform.handleException(new Error(`Device ${data.device} not registered`));
				}
			});
		});
		cb(null, data);
	};
	kinesisSource.pipe(bufferify);

	platform.notifyReady();
	platform.log('Kinesis stream has been initialized.');
});