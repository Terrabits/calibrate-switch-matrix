from   lib.calibration import create_steps
from   ddt             import ddt, data
import unittest

@ddt
class TestCalibration(unittest.TestCase):
    @data({'ports': [],              'cal unit size': 2, 'steps':[                         ]},
          {'ports': [1,2,3,4],       'cal unit size': 0, 'steps':[                         ]},
          {'ports': [1],             'cal unit size': 2, 'steps':[ [1]                     ]},
          {'ports': [1,2],           'cal unit size': 2, 'steps':[ [1,2]                   ]},
          {'ports': [1,2,3],         'cal unit size': 2, 'steps':[ [1,2], [1,3]                 ]},
          {'ports': [1,2,3,4],       'cal unit size': 2, 'steps':[ [1,2], [1,3], [1,4] ]},
          {'ports': [1,2,3,4],       'cal unit size': 3, 'steps':[ [1,2,3],      [1,4] ]},
          {'ports': [1,2,3,4],       'cal unit size': 4, 'steps':[ [1,2,3,4]               ]},
          {'ports': [1,2,3,4],       'cal unit size': 5, 'steps':[ [1,2,3,4]               ]},
          {'ports': [1,2,3,4,5,6,7], 'cal unit size': 4, 'steps':[ [1,2,3,4], [1,5,6,7]    ]})
    def test_create_steps(self, data):
        steps = create_steps(data['ports'], data['cal unit size'])
        self.assertEqual(steps, data['steps'])

if __name__ == '__main__':
    unittest.main()
