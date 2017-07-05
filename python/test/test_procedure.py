from   lib.procedure import Procedure
from   ddt           import ddt, data
from   pathlib       import Path
import unittest

@ddt
class TestProcedure(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.fixture_path = Path(__file__).parent.parent.parent / 'test' / 'fixtures'
        cls.procedures   = cls.fixture_path / 'procedures'
        cls.invalid_yaml = cls.procedures / 'invalid.yaml'
        cls.valid_proc   = cls.procedures / 'procedure.yaml'

    def test_missing_file(self):
        p = Procedure('')
        self.assertFalse(p.is_valid)

    def test_invalid_yaml_file(self):
        p = Procedure(str(self.invalid_yaml))
        self.assertFalse(p.is_valid)

    def test_valid_procedure(self):
        p = Procedure(str(self.valid_proc))
        self.assertTrue(p.is_valid)

    def test_paths_missing_files(self):
        p = Procedure('/path/to/no/procedures/procedure', set_file_extension='.zvx')
        self.assertEqual(p.filename, '/path/to/no/procedures/procedure.yaml')
        self.assertEqual(p.paths.set_file_path('nonexistent'), '/path/to/no/sets/nonexistent.zvx')
        self.assertFalse(p.paths.is_set_file('nonexistent'))
        self.assertEqual(p.paths.switch_matrix_driver_path('no-matrix'), '/path/to/no/switch matrices/no-matrix/switches.yaml')
        self.assertFalse(p.paths.is_switch_matrix_driver('no-matrix'))
        self.assertEqual(p.paths.switch_matrix_path_file('no-matrix', 'no-path'), '/path/to/no/switch matrices/no-matrix/paths/no-path.yaml')
        self.assertFalse(p.paths.is_switch_matrix_path_file('no-matrix','no-path'))

    def test_paths_exist(self):
        p = Procedure(str(self.valid_proc), set_file_extension='.zvx')
        self.assertTrue(p.is_valid)
        self.assertTrue(p.paths.is_set_file('set'))
        self.assertTrue(p.paths.is_switch_matrix_driver('matrix1'))
        self.assertTrue(p.paths.is_switch_matrix_path_file('matrix1','path1'))

if __name__ == '__main__':
    unittest.main()
