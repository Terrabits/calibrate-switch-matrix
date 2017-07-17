print(__name__)
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
        properties = [# 'name', # Don't care about name here?
                      'switch matrix',
                      'vna calibration',
                      'measurement steps']
        for i in properties:
            if not i in self.yaml or not self.yaml[i]:
                status['message'] = '{0} missing in procedure'.format(i)
                return status
        if not 'setup' in self.yaml['vna calibration'] or not self.yaml['vna calibration']['setup']:
            status['message'] = 'Could not find __ in vna calibration'
            return status
        if not 'ports' in self.yaml['vna calibration'] or not self.yaml['vna calibration']['ports']:
            status['message'] = 'Could not find __ in vna calibration'
            return status
        for step in self.yaml['measurement steps']:
            properties = [# 'name', # Don't care?
                          # 'vna connections', # Don't care?
                          'measurements']
            for p in properties:
                if not p in step or not step[p]:
                    status['message'] = '{0} missing in step(s)'.format(p)
                    return status
            for m in step['measurements']:
                if not 'switch path' in m or not m['switch path']:
                    status['message'] = 'Switch path missing in step(s)'
                    return status
                if not 'vna setup' in m or not m['vna setup']:
                    status['message'] = 'vna setup missing in step(s)'
                    return status
                if not 'vna ports' in m or not m['vna ports']:
                    status['message'] = 'vna ports missing in step(s)'
                    return status
        status['is valid'] = True
        return status

    def load(self, filename):
        if not filename.lower().endswith('.yaml'):
            filename += '.yaml'
        self.filename = filename
        self.paths    = Paths(filename)
        self.is_valid = False
        self.yaml     = read_yaml(filename)
        status = self.validate()
        self.is_valid = status['is valid']

    def matrix_name(self):
        return self.yaml['switch matrix']

    def matrix_driver_path(self):
        return self.paths.switch_matrix_driver_path(self.matrix_name())

    def calibration_set_path(self):
        return self.paths.set_file_path(self.yaml['vna calibration']['setup'])
    def calibrate_ports(self):
        return self.yaml['vna calibration']['ports']
    def calibration_steps(self):
        create_steps(self.calibration_ports, self.cal_unit_ports)
    def calibration_step_ports(self, i):
        return self.calibration_steps()[i]

    def step(self, i):
        step = self.yaml['measurement steps'][i]
        for m in step['measurements']:
            #   - switch path (yaml)
            #   - vna setup   (.zvx)
            #   - vna ports
            # add: results file
            m['results file'] = self.paths.results_path(self.matrix_name(), m['switch path'])
            m['switch path']  = self.paths.switch_matrix_path_file(self.matrix_name(), m['switch path'])
            m['vna setup']    = self.paths.set_file_path(m['vna setup'])
        return step
