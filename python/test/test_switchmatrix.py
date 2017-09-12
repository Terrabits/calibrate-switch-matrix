from   lib.switchmatrix           import Spdt, SwitchMatrix
from   rohdeschwarz.test.mock.bus import FifoBus

from   ruamel                     import yaml

from   ddt                        import ddt, data
from   pathlib                    import Path
import pdb
import unittest

def scpi_write(module, switch, state):
    scpi = 'ROUT:CLOS (@F01A{0:02d}({1:02d}{2:02d}))'
    return scpi.format(module, state, switch)
def scpi_query(module, switch, state):
    scpi = 'ROUT:CLOS? (@F01A{0:02d}({1:02d}{2:02d}))'
    return scpi.format(module, state, switch)

@ddt
class TestSwitchMatrix(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.fixture_path      = Path(__file__).parent / 'fixtures'
        cls.yaml_file         = str(cls.fixture_path / 'switch_matrix.yaml')
        cls.switch_matrix     = SwitchMatrix(cls.yaml_file)
        cls.switch_matrix.bus = FifoBus()

    def setUp(cls):
        cls.switch_matrix.bus.reset()
        cls.switch_matrix.bus.reads = ['0']*20

    @data({'value': 0, 'writes': ['ROUT:CLOS? (@F01A12(0043))', 'ROUT:CLOS (@F01A12(0043))']},
          {'value': 1, 'writes': ['ROUT:CLOS? (@F01A12(0143))', 'ROUT:CLOS (@F01A12(0143))']},
          {'value': 2, 'writes': ['ROUT:CLOS? (@F01A12(0243))', 'ROUT:CLOS (@F01A12(0243))']})
    def test_k10(self, data):
        self.switch_matrix.k10 = data['value']
        self.assertEqual(data['writes'], self.switch_matrix.bus.writes)

    def test_k14(self):
        writes = ['ROUT:CLOS? (@F01A11(0101))', 'ROUT:CLOS (@F01A11(0101))']
        self.switch_matrix.k14 = Spdt.no
        self.assertEqual(['ROUT:CLOS? (@F01A11(0101))', 'ROUT:CLOS (@F01A11(0101))'], self.switch_matrix.bus.writes)

    def test_k15(self):
        self.switch_matrix.k15 = 3
        self.assertEqual(['ROUT:CLOS? (@F01A11(0302))', 'ROUT:CLOS (@F01A11(0302))'], self.switch_matrix.bus.writes)
        self.switch_matrix.bus.reset()
        self.switch_matrix.bus.reads = ['1']
        self.switch_matrix.k15 = 3
        self.assertEqual(['ROUT:CLOS? (@F01A11(0302))'], self.switch_matrix.bus.writes)

    def test_set_switches(self):
        self.switch_matrix.bus.reads = ['0']*6
        self.switch_matrix.bus.reads.append('1')

        filename = str(self.fixture_path / 'path.yaml')
        switch_states = {}
        with open(filename, 'r') as f:
            switch_states = yaml.safe_load(f.read())
        self.switch_matrix.set_switches(switch_states)
        writes = self.switch_matrix.bus.writes
        writes.sort()

        expected = []
        expected.append(scpi_write(12, 43, Spdt.no))
        expected.append(scpi_write(11, 25, Spdt.nc))
        expected.append(scpi_write(11,  1, Spdt.nc))
        expected.append(scpi_write(11,  3, Spdt.nc))
        expected.append(scpi_write(12, 49,       2))
        expected.append(scpi_write(12, 37, Spdt.nc))
        expected.append(scpi_query(12, 43, Spdt.no))
        expected.append(scpi_query(11, 25, Spdt.nc))
        expected.append(scpi_query(11,  1, Spdt.nc))
        expected.append(scpi_query(11,  3, Spdt.nc))
        expected.append(scpi_query(12, 49,       2))
        expected.append(scpi_query(12, 37, Spdt.nc))
        expected.append('*OPC?')
        expected.sort()
        self.assertEqual(writes, expected)

if __name__ == '__main__':
    unittest.main()
