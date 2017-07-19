#!/usr/bin/env node
const IOStream = require('../src/lib/iostream.js');

const path     = require('path');
const spawn    = require('child_process').spawn;

const success_exe = path.resolve(__dirname, './spawn_success.sh');
const failure_exe = path.resolve(__dirname, './spawn_failure.sh');

function start(exe) {
  const stdout = new IOStream();
  const stderr = new IOStream();
  return new Promise((resolve, reject) => {
		const env = Object.create(process.env);
		env.PYTHONIOENCODING = 'utf-8';
		env.LANG             = "en_US.UTF-8";
		const options = {env: env, encoding: 'utf8'};
		const handleClose = (code) => {
			const result = {
				code:   code,
				stdout: stdout,
				stderr: stderr
			};
			if (code) {
				reject(result);
			}
			else {
				resolve(result);
			}
		}
		const _process = spawn(exe, ['args'], options);
		_process.stdout.on('data', stdout.writeLambda);
		_process.stderr.on('data', stderr.writeLambda);
		_process.on('close', handleClose);
	});
}

// Using promises directly
// These promises have to guaranteed execution order.
// Need to use chained promises or async/await to sync.
start(success_exe).then((result) => {
  console.log('success_exe begets success');
  console.log(`Return code: ${result.code}`);
  console.log(`stdout: '${result.stdout.text}'`);
  console.log(`stderr: '${result.stderr.text}'`);
}).catch((result) => {
  console.log('success_exe experiences failure');
  console.log(`Return code: ${result.code}`);
  console.log(`stdout: '${result.stdout.text}'`);
  console.log(`stderr: '${result.stderr.text}'`);
});

start(failure_exe).then((result) => {
  console.log('failure_exe begets success');
  console.log(`Return code: ${result.code}`);
  console.log(`stdout: '${result.stdout.text}'`);
  console.log(`stderr: '${result.stderr.text}'`);
}).catch((result) => {
  console.log('failure_exe experiences failure');
  console.log(`Return code: ${result.code}`);
  console.log(`stdout: '${result.stdout.text}'`);
  console.log(`stderr: '${result.stderr.text}'`);
});

// TODO: THIS DOES NOT WORK IN NODE 6 WITHOUT BABEL!
// Using async/await
// (async () => {
//   try {
//     let result = await start(success_exe);
//     console.log('success_exe begets success');
//     console.log(`Return code: ${result.code}`);
//     console.log(`stdout: '${result.stdout.text}'`);
//     console.log(`stderr: '${result.stderr.text}'`);
//     result = await start(failure_exe);
//   }
//   catch (result) {
//     console.log('failure_exe experiences failure');
//     console.log(`Return code: ${result.code}`);
//     console.log(`stdout: '${result.stdout.text}'`);
//     console.log(`stderr: '${result.stderr.text}'`);
//   }
// })();
