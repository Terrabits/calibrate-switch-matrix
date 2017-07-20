#!/usr/bin/env node
const start = require('../src/lib/python.js').start;
const path   = require('path');

const success_exe = path.resolve(__dirname, './spawn_success.sh');
const failure_exe = path.resolve(__dirname, './spawn_failure.sh');

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
(async () => {
  try {
    let result = await start(success_exe);
    console.log('success_exe begets success');
    console.log(`Return code: ${result.code}`);
    console.log(`stdout: '${result.stdout.text}'`);
    console.log(`stderr: '${result.stderr.text}'`);
    result = await start(failure_exe);
  }
  catch (result) {
    console.log('failure_exe experiences failure');
    console.log(`Return code: ${result.code}`);
    console.log(`stdout: '${result.stdout.text}'`);
    console.log(`stderr: '${result.stderr.text}'`);
  }
})();
