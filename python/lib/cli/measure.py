from lib.cli.matrix    import process as process_matrix
from lib.cli.procedure import process as process_procedure
from lib.cli.vna       import process as process_vna
from lib.procedure     import set_file_extension
from lib.readyaml      import read_yaml

from rohdeschwarz.instruments.vna            import Vna
from rohdeschwarz.instruments.vna.vnachannel import TouchstoneFormat

from pathlib import Path

def perform_step(args):
    vna = process_vna(args)
    matrix = process_matrix(args)
    procedure = process_procedure(args, set_file_extension(vna))

    step = procedure.step(args.step)

    for m in step['measureents']:
        # To perform a measurement:
        # 1. apply vna set file
        # 2. apply cal group
        # 3. set switch matrix path
        # 4. measure ports, save s2p file

        # 1. apply vna set file
        vna.close_sets()
        vna.open_set_locally(m['vna setup'])

        ch1 = vna.channel(1)

        # 2. apply cal group
        if args.cal_group:
            ch1.cal_group = args.cal_group
            ch1.dissolve_cal_group # TODO: Implement this

        # 3. set switch matrix path
        matrix.set_switches(read_yaml(m['switch path']))

        # 4. measure, save
        ch1.save_measurement_locally(m['results file'], m['vna ports'], TouchstoneFormat.db_degrees)
    vna.local()
    return True
