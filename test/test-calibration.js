const createSteps = require('../src/lib/calibration.js').createSteps;
const test        = require('ava');

let tests = [];

//           Tests
//         |-------------|--------------|---------------------------|
//         | ports,      | calUnitPorts | result                    |
//         |-------------|--------------|---------------------------|
tests.push([ [],           2,             []                        ]);
tests.push([ [1],          2,             [[1]]                     ]);
tests.push([ [1,2],        2,             [[1,2]]                   ]);
tests.push([ [1,2,3],      2,             [[1,2],[1,3]]             ]);
tests.push([ [1,2,3,4],    2,             [[1,2],[1,3],[1,4]]       ]);
tests.push([ [1,2,3,4,5],  2,             [[1,2],[1,3],[1,4],[1,5]] ]);
for (let [ports, calUnitPorts, result] of tests) {
  test(`$(ports) % $(calUnitPorts)`, t => {
    t.deepEqual(createSteps(ports, calUnitPorts), result);
  });
}
