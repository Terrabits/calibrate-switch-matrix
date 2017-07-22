from os.path import abspath
from pathlib import Path

def set_file_extension(vna):
    if vna.properties.is_znx():
        return '.znx'
    if vna.properties.is_zvx():
        return '.zvx'
    return '.znx'

class Paths:
    def __init__(self, filename, set_extension='.zvx'):
        if not filename.lower().endswith('.yaml'):
            filename += '.yaml'
        self.procedure       = abspath(filename)
        self.set_extension   = set_extension.lower()
        # path objects
        self.root            = Path(self.procedure).parent.parent
        self.procedures      = self.root / "procedures"
        self.sets            = self.root / "sets"
        self.switch_matrices = self.root / "switch matrices"
        self.results         = self.root / "results"

    def is_set_file(self, filename):
        if not filename.lower().endswith(self.set_extension):
            filename += self.set_extension
        return (self.sets / filename).is_file()
    def set_file_path(self, filename):
        if not filename.lower().endswith(self.set_extension):
            filename += self.set_extension
        return str(self.sets / filename)

    def is_switch_matrix_driver(self, matrix_name):
        return (self.switch_matrices / matrix_name / 'switches.yaml').is_file()
    def switch_matrix_driver_path(self, matrix_name):
        return str(self.switch_matrices / matrix_name / 'switches.yaml')

    def is_switch_matrix_path_file(self, matrix_name, filename):
        if not filename.lower().endswith('.yaml'):
            filename += '.yaml'
        return (self.switch_matrices / matrix_name / 'paths' / filename).is_file()
    def switch_matrix_path_file(self, matrix_name, filename):
        if not filename.lower().endswith('.yaml'):
            filename += '.yaml'
        return str(self.switch_matrices / matrix_name / 'paths' / filename)

    def results_file(self, matrix_name, filename):
        return str(self.results / matrix_name / filename)
