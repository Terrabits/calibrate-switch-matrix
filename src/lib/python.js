const IOStream = require('./iostream.js');
const spawn    = require('child_process').spawn;

const exe   = '../python/main';

// function start(args, onclose, stdout=null, stderr=null) {
// 	let pybin = path.resolve(root_path, exe);
// 	if (process.platform == "win32") {
// 		pybin = pybin + ".exe";
// 	}
// 	let env = Object.create(process.env);
//   	env.PYTHONIOENCODING = 'utf-8';
//   	env.LANG             = "en_US.UTF-8";
//   	options = {env: env, encoding: 'utf8'};
// 	let _process = spawn(pybin, args, options);
// 	if (stdout) {
// 		_process.stdout.on('data', stdout);
// 	}
// 	if (stderr) {
// 		_process.stderr.on('data', stderr);
// 	}
// 	_process.on('close', onclose);
// }

function promise(args) {
	let stdout = new IOStream();
	let stderr = new IOStream;
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
	return new Promise((resolve, reject) => {
		let pybin = path.resolve(root_path, exe);
		if (process.platform == "win32") {
			pybin = pybin + ".exe";
		}
		const env = Object.create(process.env);
		env.PYTHONIOENCODING = 'utf-8';
		env.LANG             = "en_US.UTF-8";
		const options = {env: env, encoding: 'utf8'};
		const _process = spawn(pybin, args, options);
		_process.stdout.on('data', stdout.writeLambda);
		_process.stderr.on('data', stderr.writeLambda);
		_process.on('close', handleClose);
	});
}

module.exports =  {
	start:   promise
};
