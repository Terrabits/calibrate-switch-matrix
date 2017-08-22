const IOStream = require('./iostream.js');
const isDev    = require('electron-is-dev');
const noDevServer = require('./no-dev-server.js');
const path     = require('path');
const spawn    = require('child_process').spawn;

class Python {
	constructor() {
		this.isWin32 = process.platform == 'win32';
		if (isDev && !noDevServer) {
      // yarn run dev
      this.exe   = path.resolve(__dirname, '../../python/__main__.py');
    }
    else {
      if (noDevServer) {
        // yarn run prod
        this.exe = path.resolve(__dirname, './python/main');
      }
      else {
        // full-on production
        // TODO: python in app.asar.unpack?
        this.exe = path.resolve(__dirname, '../../build/python/main');
      }
      if (this.isWin32) {
        this.exe += '.exe';
      }
    }
	}

	start(args=[]) {
		winston.debug('python start', {args});
		const stdout = new IOStream();
		const stderr = new IOStream();
		return new Promise((resolve, reject) => {
			const env = Object.create(process.env);
			env.PYTHONIOENCODING = 'utf-8';
			env.LANG             = "en_US.UTF-8";
			const options = {env: env, encoding: 'utf8'};
			const handleClose = (code) => {
				winston.debug('python.start handleClose', {code, stdout, stderr});
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
				winston.error('python.start handleError', {err, stdout, stderr})
				stdout.text = 'Error spawning python script.';
			};
			let exe = this.exe;
			if (this.isWin32 && this.exe.endsWith('.py')) {
				args.unshift(this.exe);
				exe = "python";
			}
			winston.debug('python start: spawning', {exe, args, options});
			const _process = spawn(exe, args, options);
			_process.stdout.on('data', stdout.writeLambda);
			_process.stderr.on('data', stderr.writeLambda);
			_process.on('error', handleError);
			_process.on('close', handleClose);
		}).then((result) => {
			winston.debug('python success', {result});
			return result.stdout.text.trim();
		}).catch((result) => {
			winston.error('python error', {result});
			if (result.stdout && result.stdout.text.trim()) {
				throw new Error(result.stdout.text.trim());
			}
			else if (result.stderr && result.stderr.text.trim()) {
				throw new Error(result.stderr.text.trim());
			}
			else {
				throw result;
			}
		});
	}
}

module.exports =  new Python();
