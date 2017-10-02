from   lib.procedure import Paths
from   ddt           import ddt, data
from   pathlib       import Path
import unittest

project_path    = Path(__file__).parent.parent.parent
test_path       = project_path  / 'test'
fixtures_path   = test_path     / 'fixtures'
procedures_root = fixtures_path / 'procedures'

@ddt
class TestProcedurePaths(unittest.TestCase):
    @data({'procedure': str(procedures_root / 'procedure.yaml'),   'has root': True},
          {'procedure': str(procedures_root / 'subdir' / '.keep'), 'has root': True},
          {'procedure': '.',                                       'has root': False})
    def test_root(self, data):
        paths = Paths(data['procedure'])
        self.assertEqual(paths.is_root(), data['has root'])
