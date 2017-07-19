const IOStream = require('./iostream.js');
const path     = require('path');
const spawn    = require('child_process').spawn;

// TODO: dev/prod paths?
const exe   = path.resolve('../python/main');

function start(args) {
	const stdout = new IOStream();
	const stderr = new IOStream();
	return new Promise((resolve, reject) => {
		let pyexe = exe;
		if (process.platform == "win32") {
			pyexe = pyexe + ".exe";
		}
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
		const _process = spawn(pyexe, args, options);
		_process.stdout.on('data', stdout.writeLambda);
		_process.stderr.on('data', stderr.writeLambda);
		_process.on('close', handleClose);
	});
}

module.exports =  {
	start
};
