from lib.procedure     import set_file_extension
from lib.cli.procedure import process as process_procedure
from lib.cli.vna       import process  as process_vna
from lib.cli.vna       import is_cal_unit, cal_unit_ports

def process_args(args):
    vna = process_vna(args)
    if not vna:
        return [None]*3
    set_file_extension = set_file_extension(vna)
    if not vna.is_cal_unit():
        return [None]*3
    # TODO: cal_unit_ports = vna.cal_unit().ports
    cal_unit_ports   = 2
    if not cal_unit_ports:
        return [None]*3
    procedure = process_procedure(args, set_file_extension, cal_unit_ports)
    if not procedure:
        return [None]*3
    return [vna, procedure]

def scpi_errors(vna):
    errors = vna.errors
    if errors:
        msg = 'SCPI command error: "{0}"'.format(errors[0][0])
        print(msg)
        return True
    return False

def start(args):
    # TODO
    [vna, procedure] = process_args(args)
    if not vna or not procedure:
        return False
    vna.is_error()
    vna.clear_status()
    # TODO: Start calibration here
    vna.open_set(procedure.calibration_set_path)
    # vna.channel(1).start_auto_cal(procedure.calibration_ports, cal_unit='default')
    return not scpi_errors(vna)

def perform_step(args):
    [vna, procedure] = process_args(args)
    if not vna or not procedure:
        return False
    vna.is_error()
    vna.clear_status()
    # TODO: Perform step code here
    ports = procedure.calibration_step_ports(args.step)
    # vna.channel(1).sweep_auto_cal(ports, cal_unit='default')
    return not scpi_errors(vna)
def apply(args):
    [vna, procedure] = process_args(args)
    if not vna or not procedure:
        return False
    vna.is_error()
    vna.clear_status()
    # TODO: Apply code here
    return not scpi_errors(vna)
def save(args):
    [vna, procedure] = process_args(args)
    if not vna or not procedure:
        return False
    vna.is_error()
    vna.clear_status()
    # TODO: Save code here
    return not scpi_errors(vna)
    return True
