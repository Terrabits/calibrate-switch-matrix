import lib.cli               as cli
from   test.helpers.args import MockArgs
from   ddt               import ddt, data
from   pathlib           import Path
import unittest

fixture_path    = Path(__file__).parent.parent.parent / 'test' / 'fixtures'
procedures_path = fixture_path    / 'procedures'
invalid_yaml    = procedures_path / 'invalid.yaml'
valid_proc      = procedures_path / 'procedure.yaml'

@ddt
class TestCli(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.fixture_path = Path(__file__).parent.parent.parent / 'test' / 'fixtures'
        cls.procedures   = cls.fixture_path / 'procedures'
        cls.invalid_yaml = cls.procedures / 'invalid.yaml'
        cls.valid_proc   = cls.procedures / 'procedure.yaml'

    @data({'address': 'rsa22471.local', 'is vna': True },
          {'address': '1.2.3.4',        'is vna': False},
          {'address': None,             'is vna': False})
    def test_is_vna(self, data):
        args = MockArgs()
        args.is_vna      = True
        args.vna_address = data['address']
        self.assertEqual(cli.vna.is_vna(args), data['is vna'])

    @data({'address': 'rsa22471.local', 'is matrix': True },
          {'address': '1.2.3.4',        'is matrix': False},
          {'address': None,             'is matrix': False})
    def test_is_matrix(self, data):
        args = MockArgs()
        args.is_matrix      = True
        args.matrix_address = data['address']
        self.assertEqual(cli.matrix.is_matrix(args), data['is matrix'])

    @data({'filename': str(invalid_yaml), 'is procedure': False},
          {'filename': str(valid_proc),   'is procedure': True})
    def test_is_procedure(self, data):
        args = MockArgs()
        args.procedure_filename = data['filename']
        self.assertEqual(cli.procedure.is_procedure(args), data['is procedure'])

if __name__ == '__main__':
    unittest.main()
