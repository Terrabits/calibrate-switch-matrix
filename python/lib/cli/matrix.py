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
    matrix = None
    root_path    = Path(args.procedure_filename).parent.parent
    try:
    	matrix = SwitchMatrix(str(root_path / 'switch_matrix.yaml'))
    except:
    	msg = "Error loading 'switch_matrix.yaml'"
    	print(msg, flush=True)
    	vna.local()
    	sys.exit(1)
    return None
