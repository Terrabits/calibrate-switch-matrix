from   lib.cli.matrix    import process as process_matrix
from   lib.cli.matrix    import init    as init_matrix
from   lib.cli.matrix    import cleanup as cleanup_matrix
from   lib.cli.procedure import process as process_procedure
from   lib.cli.vna       import process as process_vna
from   lib.cli.vna       import init    as init_vna
from   lib.cli.vna       import cleanup as cleanup_vna
from   lib.procedure     import set_file_extension
from   lib.readyaml      import read_yaml

from   rohdeschwarz.instruments.vna            import Vna
from   rohdeschwarz.instruments.vna.vnachannel import TouchstoneFormat

import os
from   pathlib import Path
import sys

def cleanup(vna, matrix):
    if vna:
        cleanup_vna(vna)
    if matrix:
        cleanup_matrix(matrix)

def perform_step(args):
    vna    = None
    matrix = None
    vna = process_vna(args)
    if not vna:
        return False
    init_vna(vna)
    procedure = process_procedure(args, set_file_extension(vna))
    if not procedure:
        cleanup(vna, matrix)
        return False
    matrix = process_matrix(args, procedure)
    if not matrix:
        cleanup(vna, matrix)
        return False
    init_matrix(matrix)
    if not args.step:
        print('Measurement step argument missing')
        cleanup(vna, matrix)
        return False
    step_index = int(args.step)
    if step_index < 0 or step_index >= procedure.number_of_steps():
        print('Invalid measurement step index')
        cleanup(vna, matrix)
        return False
    step = procedure.step(step_index)

    for m in step['measurements']:
        # To perform a measurement:
        # 1. apply vna set file
        # 2. apply cal group
        # 3. set switch matrix path
        # 4. measure ports, save s2p file

        # 1. apply vna set file
        if not Path(m['vna setup']).is_file():
            msg = "Could not find vna setup '{0}' in step '{1}'"
            msg = msg.format(m['vna setup'], step['name'])
            print(msg)
            cleanup(vna, matrix)
            return False
        vna.open_set_locally(m['vna setup'])

        if not 1 in vna.channels:
            msg = "Could not find channel 1 in '{0}' of step '{1}'"
            msg = msg.format(m['vna setup'], step['name'])
            print(msg)
            cleanup(vna, matrix)
            return False
        ch1 = vna.channel(1)

        # 2. apply cal group
        if args.cal_group:
            if not vna.is_cal_group(args.cal_group):
                msg = "VNA Cal group '{0}' not found"
                msg = msg.format(args.cal_group)
                print(msg)
                cleanup(vna, matrix)
                return False
            ch1.cal_group = args.cal_group
            ch1.dissolve_cal_group_link()

        # 3. set switch matrix path
        if not Path(m['switch path']).is_file():
            msg = "Switch path '{0}' in step '{1}' not found"
            msg = msg.format(m['switch path'], step['name'])
            print(msg)
            cleanup(vna, matrix)
            return False
        matrix.set_switches(read_yaml(m['switch path']))

        # 4. measure, save
        results_file = Path(m['results file'])
        results_folder = results_file.parent
        os.makedirs(str(results_folder), exist_ok=True)
        try:
            saved = ch1.save_measurement_locally(str(results_file), m['vna ports'], TouchstoneFormat.db_degrees)
            if not saved:
                print("'{0}' could not be saved".format(results_file.name))
                cleanup(vna, matrix)
                return False
        except:
            print('Exception saving {0}'.format(results_file.name))
            # print(sys.exc_info()[0])
            cleanup(vna, matrix)
            return False
    cleanup(vna, matrix)
    return True
