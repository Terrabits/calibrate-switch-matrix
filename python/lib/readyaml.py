from ruamel import yaml

def read_yaml(filename):
	_dict = {}
	try:
		with open(filename, 'r') as f:
			_dict = yaml.safe_load(f.read())
	except:
		pass
	return _dict
