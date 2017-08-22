#!/usr/bin/env python
from   lib.cli.driver         import find_driver
from   lib.readyaml           import read_yaml
from   lib.switchmatrix       import SwitchMatrix

from   ruamel                 import yaml

from   argparse               import ArgumentParser
from   distutils.dir_util     import mkpath
import os
from   pathlib                import Path
import socket
import sys

# cli mode only
if __name__ != '__main__':
	print('This is a command line tool')
	sys.exit(1)

# arg parse
parser = ArgumentParser(description='Set the switch matrix up for a particular path')
parser.add_argument('--matrix-address',           dest="matrix_address")
parser.add_argument('--matrix-log',               dest="matrix_log_filename")
parser.add_argument('--path',                     dest="path_filename")
args = parser.parse_args()

# is args
if not args.matrix_address:
	print('No switch matrix address')
	sys.exit(1)
if not args.path_filename:
	print('No switch matrix path file')
	sys.exit(1)
if not Path(args.path_filename).is_file():
	print('Could not find path file')
	sys.exit(1)

# read path
switches = read_yaml(args.path_filename)
if not switches:
	print('Could not read path file')
	sys.exit(1)

# find driver
driver_filename = find_driver(args.path_filename)
if not driver_filename:
	print('Could not find switch matrix driver')
	sys.exit(1)

# connect
matrix = None
try:
	matrix = SwitchMatrix(driver_filename)
	matrix.open_tcp(args.matrix_address)
except ConnectionRefusedError:
	print('Could not connect to switch matrix')
	matrix = None
except socket.timeout:
	print('Could not connect to switch matrix')
	matrix = None
except FileNotFoundError:
	print('Could not read driver')
	matrix = None
except:
	print(sys.exc_info()[0])
	matrix = None
if not matrix:
	sys.exit(1)

# log
try:
	if args.matrix_log_filename:
		matrix.open_log(args.matrix_log_filename)
		matrix.print_info()
except:
	print('Could not open log file')
	if matrix.log:
		matrix.close_log()
	matrix.close()
	sys.exit(1)

# set switch positions
matrix.is_error()
matrix.clear_status()
matrix.set_switches(switches)

# exit
matrix.is_error()
matrix.clear_status()
if matrix.log:
	matrix.close_log()
matrix.local()
matrix.close()
sys.exit(0)
