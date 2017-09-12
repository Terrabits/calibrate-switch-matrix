const {Choices}            = require('../src/lib/calibration.js')
const {Controller, Pages}  = require('../src/lib/controller.js');
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

  t.is(view.wizard.index.page, Pages.SETTINGS);
  await c.next();
  t.is(view.wizard.index.page, Pages.CHOOSE_CAL);
  view.wizard.calChoice = Choices.NONE
  await c.next();
  t.is(view.wizard.index.page, Pages.MEASURE);
  const procedure = await model.getProcedure();
  const NUM_STEPS = procedure.steps.length;
  for (let i = 0; i < NUM_STEPS; i++) {
    t.is(view.wizard.index.page, Pages.MEASURE);
    t.is(view.wizard.index.step, i);
    await c.next();
  }
  await c.next();
  t.is(view.wizard.index.page, Pages.MEASURE);
  t.is(view.wizard.index.step, NUM_STEPS-1);
});

test('Controller with saved cal basically works', async t => {
  let view  = new View();
  let model = new Model();
  model.procedureFilename = './test/fixtures/procedures/procedure.yaml';
  model.state.calGroups = ['cal group 1', 'cal group 2']

  let c = new Controller(model, view);
  await c.restart();
  t.is(view.wizard.index.page, Pages.SETTINGS);
  view.vnaAddress        = '127.0.0.1';
  view.matrixAddress     = '1.2.3.4';
  view.procedureFilename = './test/fixtures/procedures/procedure.yaml';
  await c.next();
  t.is(view.wizard.index.page, Pages.CHOOSE_CAL);
  view.wizard.calChoice = Choices.EXISTING
  view.wizard.calGroup  = 'cal group 2';
  await c.next();
  t.is(model.calChoice, Choices.EXISTING);
  t.is(model.calGroup, 'cal group 2');
  t.is(view.wizard.index.page, Pages.MEASURE);
  const procedure = await model.getProcedure();
  const NUM_STEPS = procedure.steps.length;
  for (let i = 0; i < NUM_STEPS; i++) {
    t.is(view.wizard.index.page, Pages.MEASURE);
    t.is(view.wizard.index.step, i);
    await c.next();
  }
  await c.next();
  t.is(view.wizard.index.page, Pages.MEASURE);
  t.is(view.wizard.index.step, NUM_STEPS-1);
});

test('Controller performing calibration basically works', async t => {
  let view  = new View();
  let model = new Model();
  model.procedureFilename = './test/fixtures/procedures/procedure.yaml';

  let c = new Controller(model, view);
  await c.restart();
  t.is(view.wizard.index.page, Pages.SETTINGS);
  view.vnaAddress = '127.0.0.1';
  view.matrixAddress = '1.2.3.4';
  view.procedureFilename = './test/fixtures/procedures/procedure.yaml';
  await c.next();
  t.is(view.wizard.index.page, Pages.CHOOSE_CAL);
  view.wizard.calChoice = Choices.CALIBRATE;
  await c.next();
  t.is(model.calChoice, Choices.CALIBRATE);
  t.is(view.wizard.index.page, Pages.CALIBRATE);
  t.is(view.wizard.index.step, 0);
  await c.next();
  console.log(view.alert);
  t.is(view.wizard.index.page, Pages.CALIBRATE);
  t.is(view.wizard.index.step, 1);
  await c.next();
  t.is(view.wizard.index.page, Pages.CALIBRATE);
  t.is(view.wizard.index.step, 2);
  await c.next(); // Perform and apply
  for (let i of c.history) {
    t.not(i.page, Pages.CALIBRATE);
  }

  const procedure = await model.getProcedure();
  const NUM_STEPS = procedure.steps.length;
  for (let i = 0; i < NUM_STEPS; i++) {
    t.is(view.wizard.index.page, Pages.MEASURE);
    t.is(view.wizard.index.step, i);
    await c.next();
  }
  await c.next();
  t.is(view.wizard.index.page, Pages.MEASURE);
  t.is(view.wizard.index.step, NUM_STEPS-1);
});
