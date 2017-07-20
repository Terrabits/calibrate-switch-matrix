const IOStream = require('./iostream.js');
const path     = require('path');
const spawn    = require('child_process').spawn;

function start(exe, args=[]) {
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
		};
		const handleError = (err) => {
			stdout.text = 'Error spawning python script.';
		};
		const _process = spawn(exe, args, options);
		_process.stdout.on('data', stdout.writeLambda);
		_process.stderr.on('data', stderr.writeLambda);
		_process.on('error', handleError);
		_process.on('close', handleClose);

	});
}

module.exports =  {
	start
};
