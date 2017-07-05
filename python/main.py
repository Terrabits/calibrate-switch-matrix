#!/usr/bin/env python
from   lib.cli.vna       import is_vna
from   lib.cli.vna       import is_cal_group
from   lib.cli.vna       import is_cal_unit
from   lib.cli.vna       import process as process_vna
from   lib.cli.matrix    import is_matrix
from   lib.cli.matrix    import process as process_matrix
from   lib.cli.procedure import is_procedure
from   lib.cli.procedure import process as process_procedure
import lib.cli.calibrate                as calibrate
import lib.cli.measure.perform_step     as measure

from   argparse               import ArgumentParser
from   distutils.dir_util     import mkpath
from   pathlib                import Path
import sys

# cli mode only
if __name__ != '__main__':
	print('This is a command line tool', flush=True)
	sys.exit(1)

# arg parse
parser = ArgumentParser(description='Process a switch matrix calibration procedure')
# actions
parser.add_argument('--is-vna')
parser.add_argument('--is-matrix')
parser.add_argument('--is-procedure')
parser.add_argument('--is-cal-group')
parser.add_argument('--is-cal-unit')
parser.add_argument('--cal-unit-ports')
parser.add_argument('--start-calibration')
parser.add_argument('--perform-calibration-step')
parser.add_argument('--apply-calibration')
parser.add_argument('--save-calibration')
parser.add_argument('--measure')
# settings
parser.add_argument('--vna-address',      dest="vna_address")
parser.add_argument('--vna-log',          dest="vna_log_filename")
parser.add_agrument('--cal-group',        dest="cal_group")
parser.add_argument('--matrix-address',   dest="matrix_address")
parser.add_argument('--matrix-log',       dest="matrix_log_filename")
parser.add_argument('--procedure',        dest="procedure_filename")
parser.add_argument('--step',             dest="step")
args = parser.parse_args()

# Process Actions
# --is-vna
if args.is_vna and is_vna(args):
	sys.exit(0)
else:
	sys.exit(1)

# --is-matrix
if args.is_matrix and is_matrix(args):
	sys.exit(0)
else:
	sys.exit(1)

# --is-procedure
if args.is_procedure and is_procedure(args):
	sys.exit(0)
else:
	sys.exit(1)

# --is-cal-group
if args.is_cal_group and is_cal_group(args):
	sys.exit(0)
else:
	sys.exit(1)

# --is-cal-unit
if args.is_cal_unit and is_cal_unit(args):
	sys.exit(0)
else:
	sys.exit(1)

# --cal-unit-ports
if args.is_cal_unit and cal_unit_ports(args):
	sys.exit(0)
else:
	sys.exit(1)

# --start-calibration
if args.start_calibration and calibrate.start(args):
	sys.exit(0)
else:
	sys.exit(1)

# --perform-calibration-step
if args.perform_calibration_step and calibrate.perform_step(args):
	sys.exit(0)
else:
	sys.exit(1)

# --apply-calibration
if args.apply_calibration and calibrate.apply(args):
	sys.exit(0)
else:
	sys.exit(1)

# --save-calibration
if args.save_calibration and calibrate.save(args):
	sys.exit(0)
else:
	sys.exit(1)

# --measure
if args.measure and measure(args):
	sys.exit(0)
else:
	sys.exit(1)

# else
sys.exit(0)
