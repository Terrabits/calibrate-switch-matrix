from os.path import abspath
from pathlib import Path

def set_file_extension(vna):
    if vna.properties.is_znx():
        return '.znx'
    if vna.properties.is_zvx():
        return '.zvx'
    return '.znx'

def with_extension(filename, extension):
    if not filename.lower().endswith(extension):
        filename += extension
    return filename

def has_root_dirs(path):
    # ... 'procedures' as well?
    folders = ['sets', 'switch matrices']
    for i in folders:
        i_path = path / i
        if not i_path.exists() or not i_path.is_dir():
            return False
    return True
def find_root_from(procedure_filename):
    path = Path(procedure_filename).parent
    if has_root_dirs(path):
        return path
    while len(path.parents) > 0:
        path = path.parent
        if has_root_dirs(path):
            return path
    # Could not find
    # raise Exception('Could not find root project directory')
    return False

class Paths:
    def __init__(self, filename, set_extension='.zvx'):
        self.procedure       = abspath(with_extension(filename, '.yaml'))
        self.set_extension   = set_extension.lower()
        self.root = find_root_from(self.procedure)
        if not self.root:
            return
        self.procedures      = self.root / "procedures"
        self.sets            = self.root / "sets"
        self.switch_matrices = self.root / "switch matrices"
        self.results         = self.root / "results"

    def is_root(self):
        return self.root != False
    def is_procedure(self):
        procedure = Path(self.procedure)
        return procedure.exists() and procedure.is_file()
    def is_set_file(self, filename):
        filename = with_extension(filename, self.set_extension)
        return (self.sets / filename).is_file()
    def set_file_path(self, filename):
        filename = with_extension(filename, self.set_extension)
        return str(self.sets / filename)

    def is_switch_matrix_driver(self, matrix_name):
        return (self.switch_matrices / matrix_name / 'switches.yaml').is_file()
    def switch_matrix_driver_path(self, matrix_name):
        return str(self.switch_matrices / matrix_name / 'switches.yaml')

    def is_switch_matrix_path_file(self, matrix_name, filename):
        filename = with_extension(filename, '.yaml')
        return (self.switch_matrices / matrix_name / 'paths' / filename).is_file()
    def switch_matrix_path_file(self, matrix_name, filename):
        filename = with_extension(filename, '.yaml')
        return str(self.switch_matrices / matrix_name / 'paths' / filename)

    def results_file(self, matrix_name, filename):
        return str(self.results / matrix_name / filename)
