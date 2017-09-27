// pages:
let Pages = {
  SETTINGS:   'Settings',
  CHOOSE_CAL: 'Choose calibration',
  CALIBRATE:  'Calibrate',
  MEASURE:    'Measure'
};

class PageIndex {
  constructor(calibrationSteps=-1, measurementSteps=-1) {
    this.restart();
    this.calibrationSteps = -1;
    this.measurementSteps   = -1;
  }

  restart() {
    this.page = Pages.SETTINGS;
    this.step = 0;
  }
  isSettingsPage() {
    return this.page == Pages.SETTINGS;
  }
  isChooseCalPage() {
    return this.page == Pages.CHOOSE_CAL;
  }
  setChooseCalPage() {
    this.page       = Pages.CHOOSE_CAL;
  }
  isCalibrationPage() {
    return this.page == Pages.CALIBRATE;
  }
  startCalibration() {
    this.page       = Pages.CALIBRATE;
    this.step       = 0;
  }
  setCalibrationStep(step) {
    this.startCalibration();
    if (step >= this.calibrationSteps) {
      this.step = this.calibrationSteps-1;
    }
    else {
      this.step = step;
    }
  }
  isMeasurementPage() {
    return this.page == Pages.MEASURE;
  }
  startMeasurement() {
    this.page       = Pages.MEASURE;
    this.step       = 0;
  }
  setMeasurementStep(step) {
    this.startMeasurement();
    if (step >= this.measurementSteps) {
      this.step = this.measurementSteps-1;
    }
    else {
      this.step = step;
    }
  }

  isFirstStep() {
    return this.step == 0;
  }
  isLastStep() {
    if (this.isCalibrationPage()) {
      return this.step >= this.calibrationSteps-1;
    }
    else {
      return this.step >= this.measurementSteps-1;
    }
  }
  next() {
    if (this.isSettingsPage()) {
      this.setChooseCalPage();
    }
    else if (this.isChooseCalPage()) {
      this.startMeasurement();
    }
    else if (!this.isLastStep()) {
      this.step++;
    }
    else if (this.isCalibrationPage()) {
      this.startMeasurement();
    }
    else {
      throw new Error(`PageIndex cannot go to next from ${this.page} step ${this.step}`)
    }
  }
  back() {
    if (this.isSettingsPage()) {
      return;
    }
    else if (this.isChooseCalPage()) {
      this.page = Pages.SETTINGS;
    }
    else if (!this.isFirstStep()) {
      this.step--;
    }
    else {
      // First step of calibration, measurement
      this.setChooseCalPage();
    }
  }

  copy() {
    let index  = new PageIndex();
    index.page = this.page;
    index.step = this.step;
    index.calibrationSteps = this.calibrationSteps;
    index.measurementSteps   = this.measurementSteps;
    return index;
  }
}

module.exports = {
  PageIndex,
  Pages
};
