const {Choices}            = require('../src/lib/calibration.js')
const Controller           = require('../src/lib/controller.js');
const Model                = require('./helpers/model.js');
const View                 = require('./helpers/view.js');
global.winston             = require('./helpers/winston.js');
const test                 = require('ava');

test('Controller without calibration basically works', async t => {
  let view  = new View();
  let model = new Model();
  model.procedureFilename = './test/fixtures/procedures/procedure.yaml';
  let c = new Controller(model, view);
  await c.restart();

  t.true(view.wizard.index.isSettingsPage());
  await c.next();
  t.true(view.wizard.index.isChooseCalPage());
  view.wizard.calChoice = Choices.NONE
  await c.next();
  t.true(view.wizard.index.isMeasurementPage());
  const procedure = await model.getProcedure();
  const NUM_STEPS = procedure.steps.length;
  for (let i = 0; i < NUM_STEPS; i++) {
    t.true(view.wizard.index.isMeasurementPage());
    t.is(view.wizard.index.step, i);
    await c.next();
  }
  await c.next();
  t.true(view.wizard.index.isFinishedPage());
});

test('Controller with saved cal basically works', async t => {
  let view  = new View();
  let model = new Model();
  model.procedureFilename = './test/fixtures/procedures/procedure.yaml';
  model.state.calGroups = ['cal group 1', 'cal group 2']

  let c = new Controller(model, view);
  await c.restart();
  t.true(view.wizard.index.isSettingsPage());
  view.vnaAddress        = '127.0.0.1';
  view.matrixAddress     = '1.2.3.4';
  view.procedureFilename = './test/fixtures/procedures/procedure.yaml';
  await c.next();
  t.true(view.wizard.index.isChooseCalPage());
  view.wizard.calChoice = Choices.EXISTING
  view.wizard.calGroup  = 'cal group 2';
  await c.next();
  t.is(model.calChoice, Choices.EXISTING);
  t.is(model.calGroup, 'cal group 2');
  t.true(view.wizard.index.isMeasurementPage());
  const procedure = await model.getProcedure();
  const NUM_STEPS = procedure.steps.length;
  for (let i = 0; i < NUM_STEPS; i++) {
    t.true(view.wizard.index.isMeasurementPage());
    t.is(view.wizard.index.step, i);
    await c.next();
  }
  await c.next();
  t.true(view.wizard.index.isFinishedPage());
});

test('Controller performing calibration basically works', async t => {
  let view  = new View();
  let model = new Model();
  model.procedureFilename = './test/fixtures/procedures/procedure.yaml';

  let c = new Controller(model, view);
  await c.restart();
  t.true(view.wizard.index.isSettingsPage());
  view.vnaAddress = '127.0.0.1';
  view.matrixAddress = '1.2.3.4';
  view.procedureFilename = './test/fixtures/procedures/procedure.yaml';
  await c.next();
  t.true(view.wizard.index.isChooseCalPage());
  view.wizard.calChoice = Choices.CALIBRATE;
  await c.next();
  t.is(model.calChoice, Choices.CALIBRATE);
  t.true(view.wizard.index.isCalibrationPage());
  t.is(view.wizard.index.step, 0);
  await c.next();
  t.true(view.wizard.index.isCalibrationPage());
  t.is(view.wizard.index.step, 1);
  await c.next();
  t.true(view.wizard.index.isCalibrationPage());
  t.is(view.wizard.index.step, 2);
  await c.next(); // Perform and apply
  t.true(view.wizard.index.isMeasurementPage());
  t.is(view.wizard.index.step, 0);

  const procedure = await model.getProcedure();
  const NUM_STEPS = procedure.steps.length;
  for (let i = 0; i < NUM_STEPS; i++) {
    t.true(view.wizard.index.isMeasurementPage());
    t.is(view.wizard.index.step, i);
    await c.next();
  }
  await c.next();
  t.true(view.wizard.index.isFinishedPage());
});

test('parameters: Non-existent cal group cleared', async t => {
  let view  = new View();
  let model = new Model();
  let c     = new Controller(model, view);

  model.calGroup        = 'does not exist';
  model.state.calGroups = ['cal group 1', 'cal group 2'];
  c.index.setChooseCalPage();
  let params            = await c.parameters();
  t.is(params.calGroup, 'cal group 1');
});

test('parameters: No cal groups clears cal group', async t => {
  let view  = new View();
  let model = new Model();
  let c     = new Controller(model, view);

  model.calGroup        = 'does not exist';
  model.state.calGroups = [];
  c.index.setChooseCalPage();
  let params            = await c.parameters();
  t.is(params.calGroup, '');
});
