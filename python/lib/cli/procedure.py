from lib.procedure import Procedure
from pathlib       import Path

def is_procedure(args):
    return process(args) != None

def process(args, set_file_extension='.zvx', cal_unit_ports=2):
    if not args.procedure_filename:
        print('No procedure filename')
        return None
    procedure = Procedure(args.procedure_filename, set_file_extension, cal_unit_ports)
    result = procedure.validate()
    if not result['is valid']:
        print(result['message'])
        return None
    # Success
    return procedure
