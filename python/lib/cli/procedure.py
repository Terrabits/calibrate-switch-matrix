from lib.procedure import Procedure

def is_procedure(args):
    return process(args) != None

def process(args, set_file_extension='.zvx', cal_unit_ports=2):
    # TODO
    procedure = Procedure(args.procedure_filename, set_file_extension, cal_unit_ports)
    result = procedure.validate()
    if not result['is valid']:
        print(result['message'], flush=True)
        return None
    # Success
    return procedure
