from   lib.procedure import Procedure
from   ddt           import ddt, data
from   pathlib       import Path
from   os.path       import abspath
import unittest

@ddt
class TestProcedure(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.project_path = Path(__file__).parent.parent.parent
        cls.test_path    = cls.project_path / 'test'
        cls.fixture_path = cls.test_path    / 'fixtures'
        cls.procedures   = cls.fixture_path / 'procedures'
        cls.invalid_yaml = cls.procedures   / 'invalid.yaml'
        cls.valid_proc   = cls.procedures   / 'procedure.yaml'

    def test_missing_file(self):
        p = Procedure('')
        self.assertFalse(p.validate()['is valid'])

    def test_invalid_yaml_file(self):
        p = Procedure(str(self.invalid_yaml))
        self.assertFalse(p.validate()['is valid'])

    def test_valid_procedure(self):
        p = Procedure(str(self.valid_proc))
        self.assertTrue(p.validate()['is valid'])

    def test_paths_missing_files(self):
        p = Procedure(str(self.valid_proc), set_file_extension='.zvx')
        self.assertTrue(p.paths.is_procedure())
        self.assertTrue(p.paths.is_root())
        self.assertEqual(p.paths.set_file_path('nonexistent'), abspath(str(self.fixture_path / 'sets' / 'nonexistent.zvx')))
        self.assertFalse(p.paths.is_set_file('nonexistent'))
        self.assertEqual(p.paths.switch_matrix_driver_path('no-matrix'), abspath(str(self.fixture_path / 'switch matrices' / 'no-matrix' / 'switches.yaml')))
        self.assertFalse(p.paths.is_switch_matrix_driver('no-matrix'))
        self.assertEqual(p.paths.switch_matrix_path_file('no-matrix', 'no-path'), abspath(str(self.fixture_path / 'switch matrices' / 'no-matrix' / 'paths' / 'no-path.yaml')))
        self.assertFalse(p.paths.is_switch_matrix_path_file('no-matrix','no-path'))

    def test_paths_exist(self):
        p = Procedure(str(self.valid_proc), set_file_extension='.zvx')
        print(p.validate()['message'])
        self.assertTrue(p.validate()['is valid'])
        self.assertTrue(p.paths.is_set_file('set'))
        self.assertTrue(p.paths.is_switch_matrix_driver('matrix1'))
        self.assertTrue(p.paths.is_switch_matrix_path_file('matrix1','path1'))

if __name__ == '__main__':
    unittest.main()
