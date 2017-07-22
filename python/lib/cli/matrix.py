from lib.switchmatrix                           import SwitchMatrix
from rohdeschwarz.instruments.genericinstrument import GenericInstrument

from pathlib import Path

def is_matrix(args):
    if not args.matrix_address:
    	print("Switch matrix address missing", flush=True)
    	return False

    instr = GenericInstrument()
    try:
    	instr.open_tcp(args.matrix_address)
    except:
    	msg = 'Could not find switch matrix'
    	print(msg, flush=True)
    	return False

    if args.matrix_log_filename:
    	try:
    		instr.open_log(args.matrix_log_filename)
    		instr.print_info()
    	except:
    		print('Problem generating matrix scpi log', flush=True)
    		return False

    # Success
    return True

def process(args, procedure):
    # TODO
    driver_path = procedure.matrix_driver_path()
    if not Path(driver_path).is_file():
        msg = "No switch matrix driver found at '{0}'"
        msg = msg.format(driver_path)
        print(msg)
        return None
    matrix = None
    try:
        matrix = SwitchMatrix(driver_path)
    except:
        msg = "Error loading switch matrix driver: '{0}'"
        msg = msg.format(driver_path)
        print(msg)
        return None
    try:
        matrix.open_tcp(args.matrix_address)
    	return matrix
    except:
        print("Error connecting to switch matrix")
        return None
