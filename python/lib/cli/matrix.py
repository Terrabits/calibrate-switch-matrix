from lib.switchmatrix                           import SwitchMatrix
from rohdeschwarz.instruments.genericinstrument import GenericInstrument

from pathlib import Path

def is_matrix(args):
    if not args.matrix_address:
        print('No switch matrix address')
        return False
    matrix = GenericInstrument()
    try:
        matrix.open_tcp(args.matrix_address)
    except:
        print("Could not connect to switch matrix")
        return False
    cleanup(matrix)
    return True

def process(args, procedure):
    if not args.matrix_address:
        print('No switch matrix address')
        return None
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
        msg = "Could not load switch matrix driver: '{0}'"
        msg = msg.format(driver_path)
        print(msg)
        return None
    try:
        matrix.open_tcp(args.matrix_address)
    except:
        print("Could not connect to switch matrix")
        return None
    if args.matrix_log_filename:
        try:
            matrix.open_log(args.matrix_log_filename)
            matrix.print_info()
        except:
            print('Could not open switch matrix log')
            matrix.clear_status()
            matrix.close()
            return None
    return matrix

def init(matrix):
    matrix.is_error()
    matrix.clear_status()
    matrix.preset()
    matrix.pause()

def cleanup(matrix):
    if not matrix or not matrix.connected():
        return
    matrix.is_error()
    matrix.clear_status()
    if matrix.log:
        matrix.close_log()
    matrix.close()
