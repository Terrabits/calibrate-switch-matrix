import lib.cli               as cli
from   test.helpers.args import MockArgs
from   ddt               import ddt, data
from   pathlib           import Path
from   rohdeschwarz.instruments.vna import Vna
import unittest

valid_address   = 'rsa22471.local'
invalid_address = '1.2.3.4'

fixture_path    = Path(__file__).parent.parent.parent / 'test' / 'fixtures'

procedures_path = fixture_path    / 'procedures'
invalid_yaml    = procedures_path / 'invalid.yaml'
valid_proc      = procedures_path / 'procedure.yaml'

set_file        = fixture_path    / 'sets' / 'set' # .zvx | .znb added by Vna
text_file       = valid_proc

@ddt
class TestCli(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.fixture_path = Path(__file__).parent.parent.parent / 'test' / 'fixtures'
        cls.procedures   = cls.fixture_path / 'procedures'
        cls.invalid_yaml = cls.procedures / 'invalid.yaml'
        cls.valid_proc   = cls.procedures / 'procedure.yaml'

    @data({'address': valid_address,   'is vna': True },
          {'address': invalid_address, 'is vna': False},
          {'address': None,            'is vna': False})
    def test_is_vna(self, data):
        args = MockArgs()
        args.vna_address = data['address']
        self.assertEqual(cli.vna.is_vna(args), data['is vna'])

    @data({'address': valid_address,   'is matrix': True },
          {'address': invalid_address, 'is matrix': False},
          {'address': None,            'is matrix': False})
    def test_is_matrix(self, data):
        args = MockArgs()
        args.matrix_address = data['address']
        self.assertEqual(cli.matrix.is_matrix(args), data['is matrix'])

    @data({'filename': str(invalid_yaml), 'is procedure': False},
          {'filename': str(valid_proc),   'is procedure': True})
    def test_is_procedure(self, data):
        args = MockArgs()
        args.procedure_filename = data['filename']
        self.assertEqual(cli.procedure.is_procedure(args), data['is procedure'])

    @data({'filename': str(set_file),  'result': True},
          {'filename': None,           'result': None},
          {'filename': str(text_file), 'result': False})
    def test_init_vna(self, data):
        filename = data['filename']
        success  = data['result']
        vna = Vna()
        vna.open_tcp(valid_address)
        self.assertTrue(vna.id_string())
        self.assertEqual(cli.vna.init(vna, filename), success)

if __name__ == '__main__':
    unittest.main()
