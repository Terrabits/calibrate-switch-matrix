const spawn = require('child_process').spawn;

function start(args, onclose, stdout=null, stderr=null) {
	pybin = path.resolve(root_path, '../run/run');
	if (process.platform == "win32") {
		pybin = pybin + ".exe";
	}
	var env = Object.create(process.env);
  	env.PYTHONIOENCODING = 'utf-8';
  	env.LANG             = "en_US.UTF-8";
  	options = {env: env, encoding: 'utf8'};
	var _process = spawn(pybin, args, options);
	if (stdout) {
		_process.stdout.on('data', stdout);
	}
	if (stderr) {
		_process.stderr.on('data', stderr);
	}
	_process.on('close', onclose);
}
function startSync(args) {
	pybin = path.resolve(root_path, '../run/run');
	if (process.platform == "win32") {
		pybin = pybin + ".exe";
	}
	var env = Object.create(process.env);
  	env.PYTHONIOENCODING = 'utf-8';
  	env.LANG             = "en_US.UTF-8";
  	options = {env: env, encoding: 'utf8'};
	return spawn(pybin, args, options);
}

module.exports =  {
	start:     start,
	startSync: startSync
};
