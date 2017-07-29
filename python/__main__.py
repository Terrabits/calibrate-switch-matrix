#!/usr/bin/env python
import lib.cli.calibrate                     as calibrate
from   lib.cli.matrix    import is_matrix
from   lib.cli.matrix    import process      as process_matrix
from   lib.cli.measure   import perform_step as measure
# from   lib.cli.procedure import is_procedure
# from   lib.cli.procedure import process as process_procedure
from   lib.cli.vna       import is_vna
from   lib.cli.vna       import cal_groups
from   lib.cli.vna       import is_cal_unit
from   lib.cli.vna       import cal_unit_ports
from   lib.cli.vna       import process      as process_vna

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
parser.add_argument('--is-vna', action='store_true')
parser.add_argument('--is-matrix', action='store_true')
# parser.add_argument('--is-procedure')
parser.add_argument('--cal-groups',               action='store_true')
parser.add_argument('--is-cal-unit',              action='store_true')
parser.add_argument('--cal-unit-ports',           action='store_true')
parser.add_argument('--start-calibration',        action='store_true')
parser.add_argument('--perform-calibration-step', action='store_true')
parser.add_argument('--apply-calibration',        action='store_true')
parser.add_argument('--save-calibration',         action='store_true')
parser.add_argument('--measure',                  action='store_true')
# settings
parser.add_argument('--vna-address',              dest="vna_address")
parser.add_argument('--vna-log',                  dest="vna_log_filename")
parser.add_argument('--cal-group',                dest="cal_group")
parser.add_argument('--matrix-address',           dest="matrix_address")
parser.add_argument('--matrix-log',               dest="matrix_log_filename")
parser.add_argument('--procedure',                dest="procedure_filename")
parser.add_argument('--step',                     dest="step")
args = parser.parse_args()

def conditional_exit(vna, is_success):
	vna.is_error()
	vna.clear_status()
	vna.local()
	vna.close()
	sys.exit(0 if is_success else 1)

# Process Actions
# --is-vna
if args.is_vna:
	conditional_exit(is_vna(args))

# --is-matrix
if args.is_matrix:
	conditional_exit(is_matrix(args))

# --is-cal-group
if args.cal_groups:
	conditional_exit(cal_groups(args))

# --is-cal-unit
if args.is_cal_unit:
	conditional_exit(is_cal_unit(args))

# --cal-unit-ports
if args.cal_unit_ports:
	conditional_exit(cal_unit_ports(args))

# --start-calibration
if args.start_calibration:
	conditional_exit(calibrate.start(args))

# --perform-calibration-step
if args.perform_calibration_step:
	conditional_exit(calibrate.perform_step(args))

# --apply-calibration
if args.apply_calibration:
	conditional_exit(calibrate.apply(args))

# --save-calibration
if args.save_calibration:
	conditional_exit(calibrate.save(args))

# --measure
if args.measure:
	conditional_exit(measure(args))

# else
print('No action given.')
sys.exit(1)
