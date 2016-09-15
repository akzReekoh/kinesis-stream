'use strict';

var platform = require('./platform');

/**
 * Emitted when the platform shuts down the plugin. The Stream should perform cleanup of the resources on this event.
 */
platform.once('close', function () {
	platform.notifyClose();
});

/**
 * Emitted when the platform bootstraps the plugin. The plugin should listen once and execute its init process.
 * Afterwards, platform.notifyReady() should be called to notify the platform that the init process is done.
 * @param {object} options The parameters or options. Specified through config.json.
 */
platform.once('ready', function (options) {
	let async         = require('async'),
		kinesis       = require('kinesis'),
		isEmpty       = require('lodash.isempty'),
		isPlainObject = require('lodash.isplainobject');

	let kinesisSource = kinesis.stream({
		name: options.stream_name,
		region: options.region,
		oldest: true,
		credentials: {
			accessKeyId: options.access_key_id,
			secretAccessKey: options.secret_access_key
		}
	});

	kinesisSource.on('data', function (record) {
		let data = new Buffer(record.Data).toString('utf8');

		console.log(data);
		async.waterfall([
			async.constant(data || '{}'),
			async.asyncify(JSON.parse)
		], (error, obj) => {
			if (isEmpty(obj.device) || !isPlainObject(obj)) return platform.handleException(new Error('Invalid data sent. Data must be a valid JSON with at least a "device" field which corresponds to a registered Device ID.'));

			platform.requestDeviceInfo(obj.device, function (error, requestId) {
				platform.once(requestId, function (deviceInfo) {
					if (deviceInfo)
						platform.processData(obj, data);
					else
						platform.handleException(new Error(`Device ${obj.device} not registered`));
				});
			});
		});
	}).on('end', function () {
		console.log('Stream Ended');
	}).on('error', function (error) {
		platform.handleException(error);
	});

	platform.notifyReady();
	platform.log('Kinesis stream has been initialized.');
});