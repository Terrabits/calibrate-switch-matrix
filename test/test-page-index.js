const {PageIndex, Pages} = require('../src/lib/page-index.js');
const test      = require('ava');

test('default constructor', t => {
  const index = new PageIndex();
  t.is(index.page, Pages.SETTINGS);
});

test('restart', t => {
  const index = new PageIndex();
  index.next();
  t.not(index.page, Pages.SETTINGS);

  index.restart();
  t.is(index.page, Pages.SETTINGS);
});
test('set choose cal page', t => {
  const index = new PageIndex();
  index.setChooseCalPage();
  t.is(index.page, Pages.CHOOSE_CAL);
  t.true(index.isChooseCalPage());
});
test('start calibration', t => {
  const index = new PageIndex();
  index.calibrationSteps = 10;
  index.startCalibration();
  t.is(index.page, Pages.CALIBRATE);
  t.is(index.step, 0);
});
test('is first calibration step', t => {
  const index = new PageIndex();
  index.calibrationSteps = 2;
  index.startCalibration();
  t.true(index.isFirstStep());
  t.not(index.isLastStep());
});
test('is last calibration step', t => {
  const index = new PageIndex();
  index.calibrationSteps = 2;
  index.setCalibrationStep(1);
  t.not(index.isFirstStep());
  t.true(index.isLastStep());
});
test('set calibration step', t => {
  const index = new PageIndex();
  index.calibrationSteps = 10;
  index.setCalibrationStep(5);
  t.true(index.isCalibrationPage());
  t.is(index.step, 5);
});
test('complete calibration', t => {
  const STEPS = 3;
  const index = new PageIndex();
  index.calibrationSteps = STEPS;
  index.measurementSteps   = 1;
  index.startCalibration();
  for (let i = 0; i < STEPS-1; i++) {
    t.is(index.page, Pages.CALIBRATE);
    t.is(index.step, i);
    index.next();
  }
  t.true(index.isCalibrationPage());
  t.true(index.isLastStep());
  index.next();
  t.true(index.isMeasurementPage());
  t.is(index.step, 0);
});
test('start measurement', t => {
  const index = new PageIndex();
  index.measurementSteps = 10;
  index.startMeasurement();
  t.is(index.page, Pages.MEASURE);
  t.is(index.step, 0);
});
test('is first measurement step', t => {
  const index = new PageIndex();
  index.measurementSteps = 2;
  index.startMeasurement();
  t.true(index.isFirstStep());
  t.not(index.isLastStep());
});
test('is last measurement step', t => {
  const index = new PageIndex();
  index.measurementSteps = 2;
  index.setMeasurementStep(1);
  t.not(index.isFirstStep());
  t.true(index.isLastStep());
});
test('set measurement step', t => {
  const index = new PageIndex();
  index.measurementSteps = 10;
  index.setMeasurementStep(5);
  t.true(index.isMeasurementPage());
  t.is(index.step, 5);
});
test('complete measurement', t => {
  const STEPS = 3;
  const index = new PageIndex();
  index.measurementSteps = STEPS;
  index.startMeasurement();
  for (let i = 0; i < STEPS-1; i++) {
    t.is(index.page, Pages.MEASURE);
    t.is(index.step, i);
    index.next();
  }
  t.true(index.isLastStep());
});
test('procedure without calibration', t => {
  const STEPS = 10;
  const index = new PageIndex();
  index.measurementSteps = STEPS;
  t.true(index.isSettingsPage());
  index.next();
  t.true(index.isChooseCalPage());
  index.next();
  for (i = 0; i < STEPS-1; i++) {
    t.true(index.isMeasurementPage());
    t.is(index.step, i);
    index.next();
  }
  t.true(index.isLastStep());
});
test('procedure with calibration', t => {
  const CALIBRATION_STEPS = 3;
  const MEASUREMENT_STEPS = 10;
  const index = new PageIndex();
  index.calibrationSteps = CALIBRATION_STEPS;
  index.measurementSteps = MEASUREMENT_STEPS;
  t.true(index.isSettingsPage());
  index.next();
  t.true(index.isChooseCalPage());

  index.startCalibration();
  t.true(index.isCalibrationPage());
  t.true(index.isFirstStep());
  for (i = 0; i < CALIBRATION_STEPS-1; i++) {
    t.true(index.isCalibrationPage());
    t.is(index.step, i);
    index.next();
  }
  t.true(index.isLastStep());
  index.next();

  for (i = 0; i < MEASUREMENT_STEPS-1; i++) {
    t.true(index.isMeasurementPage());
    t.is(index.step, i);
    index.next();
  }
  t.true(index.isLastStep());
});
test('back from settings page does nothing', t => {
  const index = new PageIndex();
  t.true(index.isSettingsPage());
  index.back();
  t.true(index.isSettingsPage());
});
test('back from last measurement', t => {
  const STEPS = 10;
  const index = new PageIndex();
  index.measurementSteps = STEPS;
  index.setMeasurementStep(STEPS-1)
  t.true(index.isMeasurementPage());
  t.true(index.isLastStep());

  for (i = STEPS-1; i > 0; i--) {
    t.true(index.isMeasurementPage());
    t.is(index.step, i);
    index.back();
  }
  t.true(index.isMeasurementPage())
  t.true(index.isFirstStep())
  index.back();
  t.true(index.isChooseCalPage());
  index.back();
  t.true(index.isSettingsPage());
});
