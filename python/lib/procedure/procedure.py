from lib.calibration     import create_steps
from lib.procedure.paths import Paths
from lib.readyaml        import read_yaml

from pathlib             import Path

class Procedure:
    def __init__(self, filename='', set_file_extension='.zvx', cal_unit_ports=0):
        self.load(filename)
        self.paths = Paths(filename, set_file_extension)
        self.cal_unit_ports = cal_unit_ports

    def validate(self):
        status = {'is valid': False, 'message': ''}
        if not self.yaml:
            status['message'] = 'Could not read procedure file'
            return status

        # Confirm presence of switch matrix,
        # vna calibration and measurement steps
        properties = [# 'name', # Don't care about name here?
                      'switch matrix',
                      'vna calibration',
                      'measurement steps']
        for i in properties:
            if not i in self.yaml or not self.yaml[i]:
                status['message'] = '{0} missing in procedure'.format(i)
                return status

        # validate switch matrix
        if not Path(self.matrix_driver_path()).is_file():
            status['message'] = 'Could not find switch matrix driver'
            return status
        if not read_yaml(self.matrix_driver_path()):
            status['message'] = 'Could not read switch matrix driver'
            return status

        # validate vna calibration
        if not 'setup' in self.yaml['vna calibration'] or not self.yaml['vna calibration']['setup']:
            status['message'] = 'Could not find setup in vna calibration'
            return status
        if not self.paths.is_set_file(self.yaml['vna calibration']['setup']):
            status['message'] = 'VNA calibration setup not found'
            return status
        if not 'ports' in self.yaml['vna calibration'] or not self.yaml['vna calibration']['ports']:
            status['message'] = 'Could not find ports in vna calibration'
            return status
        ports = self.yaml['vna calibration']['ports']
        if error_in_ports(ports):
            status['message'] = error_in_ports(ports)
            return status

        # validate measurement steps
        for step in self.yaml['measurement steps']:
            properties = [# 'name', # Don't care?
                          # 'vna connections', # Don't care?
                          'measurements']
            for p in properties:
                if not p in step or not step[p]:
                    status['message'] = "{0} missing in step(s)".format(p)
                    return status
            for m in step['measurements']:
                if not 'switch path' in m or not m['switch path']:
                    status['message'] = 'Switch path missing in step(s)'
                    return status
                if not self.paths.is_switch_matrix_path_file(self.yaml['switch matrix'], m['switch path']):
                    status['message'] = "Switch path '{0}' not found".format(m['switch path'])
                    return status
                if not 'vna setup' in m or not m['vna setup']:
                    status['message'] = 'vna setup missing in step(s)'
                    return status
                if not self.paths.is_set_file(m['vna setup']):
                    status['message'] = "VNA setup '{0}' not found".format(m['vna setup'])
                    return status
                if not 'vna ports' in m or not m['vna ports']:
                    status['message'] = 'vna ports missing in step(s)'
                    return status
                ports = m['vna ports']
                if error_in_ports(ports):
                    status['message'] = error_in_ports(ports)
                    return status
        status['is valid'] = True
        return status

    def load(self, filename):
        if not filename.lower().endswith('.yaml'):
            filename += '.yaml'
        self.filename = filename
        self.paths    = Paths(filename)
        self.yaml     = read_yaml(filename)
        return self.validate()['is valid']

    def matrix_name(self):
        return self.yaml['switch matrix']

    def matrix_driver_path(self):
        return self.paths.switch_matrix_driver_path(self.matrix_name())

    def calibration_set_path(self):
        return self.paths.set_file_path(self.yaml['vna calibration']['setup'])
    def calibrate_ports(self):
        return self.yaml['vna calibration']['ports']
    def calibration_steps(self):
        return create_steps(self.calibrate_ports(), self.cal_unit_ports)
    def calibration_step_ports(self, i):
        return self.calibration_steps()[i]
    def number_of_steps(self):
        return len(self.yaml['measurement steps'])
    def step(self, i):
        step = self.yaml['measurement steps'][i]
        for m in step['measurements']:
            # - results file (extension added by vna)
            # - switch path
            # - vna setup
            # - vna ports
            results_file = str(Path(m['switch path']).name)
            if results_file.lower().endswith('.yaml'):
                results_file = results_file[:-5]
            m['results file'] = self.paths.results_file(self.matrix_name(), results_file)
            m['switch path']  = self.paths.switch_matrix_path_file(self.matrix_name(), m['switch path'])
            m['vna setup']    = self.paths.set_file_path(m['vna setup'])
        return step

def error_in_ports(ports):
    if not isinstance(ports, list):
        return 'VNA calibration: ports list is invalid'
    if not len(ports) > 0:
        return 'VNA calibration: no ports found'
    for i in ports:
        try:
            i = int(i)
            assert i > 0
        except:
             return 'VNA calibration: {0} not valid port number'
    return None
