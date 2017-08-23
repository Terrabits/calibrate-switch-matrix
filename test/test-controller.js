const {Choices}            = require('../src/lib/calibration.js')
const {Controller, Pages}  = require('../src/lib/controller.js');
const Model                = require('./helpers/model.js');
const View                 = require('./helpers/view.js');
global.winston             = require('./helpers/winston.js');
const test                 = require('ava');

let model = new Model();
let view  = new View();

test('Controller without calibration basically works', t => {
  let c = new Controller(model, view);
  t.is(c.index.page, Pages.SETTINGS);
  view.vnaAddress = '127.0.0.1';
  view.matrixAddress = '1.2.3.4';
  view.procedureFilename = './test/fixtures/procedures/procedure.yaml';
  c.next();
  t.is(c.index.page, Pages.CHOOSE_CAL);
  view.calChoice = Choices.NONE
  c.next();
  t.is(c.index.page, Pages.MEASURE);
  const NUM_STEPS = c.model.getProcedure().steps.length;
  for (let i = 0; i < NUM_STEPS; i++) {
    t.is(c.index.page, Pages.MEASURE);
    t.is(c.index.step, i);
    c.next();
  }
  c.next();
  t.is(c.index.page, Pages.MEASURE);
  t.is(c.index.step, NUM_STEPS-1);
});

test('Controller with saved cal basically works', t => {
  let c = new Controller(model, view);
  t.is(c.index.page, Pages.SETTINGS);
  view.vnaAddress = '127.0.0.1';
  view.matrixAddress = '1.2.3.4';
  view.procedureFilename = './test/fixtures/procedures/procedure.yaml';
  c.next();
  t.is(c.index.page, Pages.CHOOSE_CAL);
  view.calChoice = Choices.EXISTING
  view.calGroup = 'saved cal';
  c.next();
  t.is(c.index.page, Pages.MEASURE);
  const NUM_STEPS = c.model.getProcedure().steps.length;
  for (let i = 0; i < NUM_STEPS; i++) {
    t.is(c.index.page, Pages.MEASURE);
    t.is(c.index.step, i);
    c.next();
  }
  c.next();
  t.is(c.index.page, Pages.MEASURE);
  t.is(c.index.step, NUM_STEPS-1);
});

test('Controller performing calibration basically works', t => {
  let c = new Controller(model, view);
  t.is(c.index.page, Pages.SETTINGS);
  view.vnaAddress = '127.0.0.1';
  view.matrixAddress = '1.2.3.4';
  view.procedureFilename = './test/fixtures/procedures/procedure.yaml';
  c.next();
  t.is(c.index.page, Pages.CHOOSE_CAL);
  view.calChoice = Choices.CALIBRATE
  c.next();
  t.is(c.index.page, Pages.CALIBRATE);
  t.is(c.index.step, 0);
  c.next();
  t.is(c.index.page, Pages.CALIBRATE);
  t.is(c.index.step, 1);
  c.next();
  t.is(c.index.page, Pages.CALIBRATE);
  t.is(c.index.step, 2);
  c.next(); // Perform and apply
  for (let i of c.history) {
    t.not(i.page, Pages.CALIBRATE);
  }

  const NUM_STEPS = c.model.getProcedure().steps.length;
  for (let i = 0; i < NUM_STEPS; i++) {
    t.is(c.index.page, Pages.MEASURE);
    t.is(c.index.step, i);
    c.next();
  }
  c.next();
  t.is(c.index.page, Pages.MEASURE);
  t.is(c.index.step, NUM_STEPS-1);
});
