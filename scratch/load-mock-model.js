const MockModel = require('/Users/nicholaslalic/Documents/Node/calibrate-switch-matrix/test/helpers/model.js');

const mockModel = new MockModel();
mockModel.procedureFilename = './test/fixtures/procedures/procedure.yaml';

window.mockModel = mockModel;
controller.model = mockModel;
controller.render();
