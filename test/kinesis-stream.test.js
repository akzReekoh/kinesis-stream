// 'use strict';
//
// var cp     = require('child_process'),
// 	assert = require('assert'),
// 	stream;
//
// describe('Stream', function () {
// 	this.slow(5000);
//
// 	after('terminate child process', function (done) {
// 		this.timeout(65000);
//
// 		setTimeout(() => {
// 			stream.kill('SIGKILL');
// 			done();
// 		}, 60000);
// 	});
//
// 	describe('#spawn', function () {
// 		it('should spawn a child process', function () {
// 			assert.ok(stream = cp.fork(process.cwd()), 'Child process not spawned.');
// 		});
// 	});
//
// 	describe('#handShake', function () {
// 		it('should notify the parent process when ready within 5 seconds', function (done) {
// 			this.timeout(10000);
//
// 			stream.on('message', function (message) {
// 				if (message.type === 'ready')
// 					done();
// 				else if (message.type === 'requestdeviceinfo') {
// 					if (message.data.deviceId === '1C84A6') {
// 						stream.send({
// 							type: message.data.requestId,
// 							data: {
// 								_id: message.data.deviceId
// 							}
// 						});
// 					}
// 				}
// 			});
//
// 			stream.send({
// 				type: 'ready',
// 				data: {
// 					options: {
// 						stream_name: 'sigfoxstream',
// 						region: 'us-west-2',
// 						access_key_id: 'AKIAJAV4XF3CYHQEM24A',
// 						secret_access_key: '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'
// 					}
// 				}
// 			}, function (error) {
// 				assert.ifError(error);
// 			});
// 		});
// 	});
// });