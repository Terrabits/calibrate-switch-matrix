const {Controller, Pages} = require('../src/lib/controller.js');
const Model               = require('./helpers/model.js');
const View                = require('./helpers/view.js');
const test                = require('ava');

let model = new Model();
let view  = new View();
view.procedureFilename = './test/fixtures/procedures/procedure.yaml';

test('Controller without calibration basically works', t => {
  let c = new Controller(model, view);
  t.is(c.index.page, Pages.VNA);
  c.next();
  t.is(c.index.page, Pages.OSP);
  c.next();
  t.is(c.index.page, Pages.CHOOSE_PROCEDURE);
  c.next();
  t.is(c.index.page, Pages.CHOOSE_CAL);
  c.skipCalibration();
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
  t.is(c.index.page, Pages.VNA);
  c.next();
  t.is(c.index.page, Pages.OSP);
  c.next();
  t.is(c.index.page, Pages.CHOOSE_PROCEDURE);
  c.next();
  t.is(c.index.page, Pages.CHOOSE_CAL);
  c.useCalGroup('saved cal');
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
  t.is(c.index.page, Pages.VNA);
  c.next();
  t.is(c.index.page, Pages.OSP);
  c.next();
  t.is(c.index.page, Pages.CHOOSE_PROCEDURE);
  c.next();

  t.is(c.index.page, Pages.CHOOSE_CAL);
  c.startCalibration();
  t.is(c.index.page, Pages.CALIBRATE);
  t.is(c.index.step, 0);
  c.next();
  t.is(c.index.page, Pages.CALIBRATE);
  t.is(c.index.step, 1);
  c.next();
  t.is(c.index.page, Pages.CALIBRATE);
  t.is(c.index.step, 2);
  c.next(); // Perform and apply

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
