'use strict'

let reekoh = require('reekoh')
let _plugin = new reekoh.plugins.Stream()

_plugin.once('ready', () => {
  let async = require('async')
  let kinesis = require('kinesis')
  let isEmpty = require('lodash.isempty')
  let isPlainObject = require('lodash.isplainobject')

  let kinesisSource = kinesis.stream({
    name: _plugin.config.streamName,
    region: _plugin.config.region,
    oldest: true,
    credentials: {
      accessKeyId: _plugin.config.accessKeyId,
      secretAccessKey: _plugin.config.secretAccessKey
    }
  })

  kinesisSource.on('data', (record) => {
    let data = new Buffer(record.Data).toString('utf8')

    async.waterfall([
      async.constant(data || '{}'),
      async.asyncify(JSON.parse)
    ], (error, obj) => {
      if (error) return _plugin.logException(error)
      if (isEmpty(obj.device) || !isPlainObject(obj)) return _plugin.logException(new Error('Invalid data sent. Data must be a valid JSON with at least a "device" field which corresponds to a registered Device ID.'))

      _plugin.requestDeviceInfo(obj.device)
        .then((deviceInfo) => {
          if (deviceInfo) {
            _plugin.pipe(deviceInfo)
              .then(() => {
                _plugin.log(JSON.stringify({
                  title: 'Kinesis Stream - Data Received',
                  data: deviceInfo
                }))
              })
          } else _plugin.logException(new Error(`Device ${obj.device} is not registered.`))
        })
        .catch((err) => {
          _plugin.logException(err)
        })
    })
  }).on('end', () => {
    console.log('Stream Ended')
  }).on('error', (error) => {
    _plugin.logException(error)
  })

  _plugin.log('Kinesis stream has been initialized.')
})
