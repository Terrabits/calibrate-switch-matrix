const {Choices}           = require('../src/lib/calibration.js');
const {Controller, Pages} = require('../src/lib/controller.js');
const Model               = require('../test/helpers/model.js');
const View                = require('../test/helpers/view.js');

let view  = new View();
view.vnaAddress        = 'localhost';
view.matrixAddress     = '1.2.3.4';
view.procedureFilename = './test/fixtures/procedures/procedure.yaml';
view.calChoice         = Choices.CALIBRATE;
view.calGroup          = null;

let model = new Model();
let c     = new Controller(model, view)

c.next(); // accept vna, matrix, procedure
c.next(); // accept Choices.CALIBRATE
c.next(); // cal step 1/3
c.next(); // cal step 2/3
c.next(); // cal step 3/3, => measure

console.log('===HISTORY===')
for (let i of c.history) {
  console.log(`${i.page}`);
}
