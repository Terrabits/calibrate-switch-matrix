var {Choices}            = require('../src/lib/calibration.js')
var {Controller, Pages}  = require('../src/lib/controller.js');
var Model                = require('../test/helpers/model.js');
var View                 = require('../test/helpers/view.js');
global.winston           = require('../test/helpers/winston.js');

var model = new Model();
model.vnaAddress        = '127.0.0.1';
model.matrixAddress     = '1.2.3.4';
model.procedureFilename = './test/fixtures/procedures/procedure.yaml';

var view  = new View();

var c = new Controller(model, view);
