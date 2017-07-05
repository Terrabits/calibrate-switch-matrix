let Choices = {
  NONE: 'no calibration',
  EXISTING: 'use existing calibration',
  CALIBRATE: 'calibrate'
}

function createSteps(ports, calUnitSize) {
  if (calUnitSize <= 1) {
    return [];
  }
  if (ports.length == 0) {
    return [];
  }
  if (ports.length == 1) {
    return [ports];
  }

  ports.sort();
  const [commonPort] = ports.splice(0,1);
  let steps = [];
  while (ports.length) {
    if (ports.length > calUnitSize-1) {
      steps.push([commonPort, ...ports.splice(0, calUnitSize-1)]);
    }
    else {
      steps.push([commonPort, ...ports.splice(0)]);
    }
  }
  return steps;
}

module.exports = {
  Choices: Choices,
  createSteps: createSteps
};
