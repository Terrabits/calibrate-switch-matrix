from lib.procedure     import set_file_extension
from lib.cli.procedure import process as process_procedure
from lib.cli.vna       import process as process_vna
from lib.cli.vna       import init    as init_vna
from lib.cli.vna       import cleanup as cleanup_vna
from lib.cli.vna       import is_cal_unit, cal_unit_ports

from pathlib           import Path

def process_args(args):
    vna = process_vna(args)
    if not vna:
        return [None]*2
    file_extension = set_file_extension(vna)
    if not vna.cal_units:
        return [None]*2
    # TODO: cal_unit_ports = vna.cal_unit().ports
    cal_unit_ports   = vna.cal_unit().ports
    if not cal_unit_ports:
        return [None]*2
    procedure = process_procedure(args, file_extension, cal_unit_ports)
    if not procedure:
        return [None]*2
    return [vna, procedure]

def scpi_errors(vna):
    errors = vna.errors
    if errors:
        err0 = errors[0]
        msg = "SCPI command error {0}: '{1}'".format(err0[0], err0[1])
        print(msg)
        return True
    return False

def start(args):
    # TODO
    [vna, procedure] = process_args(args)
    if not vna or not procedure:
        return False
    if vna.properties.is_zvx():
        print('Calibrate does not work with ZVA yet...')
        cleanup_vna(vna)
        return False
    # TODO: Start calibration here
    set_path = procedure.calibration_set_path()
    if not Path(set_path).is_file():
        print('Could not find calibration setup file')
        cleanup_vna(vna)
        return False
    if not init_vna(vna, set_path):
        msg = "Error loading vna calibration setup '{0}'"
        msg = msg.format(m['vna setup'], step['name'])
        print(msg)
        cleanup(vna, matrix)
        return False

    vna.write("SENS1:CORR:COLL:AUTO:CONF FNP, ''")
    steps = procedure.calibration_steps()
    for i in range(0, len(steps)):
        scpi = 'SENS1:CORR:COLL:AUTO:ASS{0}:DEF:TPOR {1}'
        scpi = scpi.format(i+1, ",".join(map(str,steps[i])))
        vna.write(scpi)
    if scpi_errors(vna):
        cleanup_vna(vna)
        return False
    else:
        return True

def perform_step(args):
    [vna, procedure] = process_args(args)
    if not vna or not procedure:
        return False
    vna.is_error()
    vna.clear_status()
    ports = procedure.calibration_step_ports(args.step)
    # TODO: Check for port connections?
    scpi = 'SENS1:CORR:COLL:AUTO:ASS{0}:ACQuire'
    scpi = scpi.format(args.step)
    vna.write(scpi)
    vna.pause(10*60*1000) # 10 mins
    return not scpi_errors(vna)
def apply(args):
    [vna, procedure] = process_args(args)
    if not vna or not procedure:
        return False
    vna.is_error()
    vna.clear_status()
    scpi = 'SENS1:CORR:COLL:AUTO:SAVE'
    vna.write(scpi)
    vna.pause(30*60*1000) # 30 s
    return not scpi_errors(vna)
def save(args):
    [vna, procedure] = process_args(args)
    if not vna or not procedure:
        return False
    vna.is_error()
    vna.clear_status()
    vna.channel().save_cal(args.cal_group)
    if scpi_errors(vna):
        return False
    else:
        cleanup_vna(vna)
        return True
