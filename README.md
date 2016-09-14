# kinesis-stream
[![Build Status](https://travis-ci.org/Reekoh/kinesis-stream.svg)](https://travis-ci.org/Reekoh/kinesis-connector)
![Dependencies](https://img.shields.io/david/Reekoh/kinesis-stream.svg)
![Dependencies](https://img.shields.io/david/dev/Reekoh/kinesis-stream.svg)
![Built With](https://img.shields.io/badge/built%20with-gulp-red.svg)

## Description
AWS Kinesis Stream Plugin. Subscribes and ingests sensor data being published to a Kinesis Stream.

## Configuration
To configure this plugin, an Amazon AWS Kinesis account and Kinesis stream is needed to provide the following:

1. Access Key ID - AWS Access Key ID to use.
2. Secret Access Key - AWS Secret Access Key to use.
3. Region - AWS Region to use.
5. Stream Name - AWS Kinesis Stream Name to use.

These parameters are then injected to the plugin from the platform.