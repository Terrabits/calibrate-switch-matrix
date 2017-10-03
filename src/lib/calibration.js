let Choices = {
  NONE: 'no calibration',
  EXISTING: 'use existing calibration',
  CALIBRATE: 'calibrate'
}

function createCalUnitMap() {
  let i = 0;
  return (vnaPort) => {
    i++;
    return [vnaPort, i];
  };
}

function createSteps(ports, calUnitSize) {
  if (calUnitSize <= 1) {
    return [];
  }
  if (ports.length == 0) {
    return [];
  }
  if (ports.length == 1) {
    return [[[ports[0],1]]];
  }

  ports.sort();
  const [commonPort] = ports.splice(0,1);
  let steps = [];
  while (ports.length) {
    let vnaPorts = null;
    if (ports.length > calUnitSize-1) {
      vnaPorts = [commonPort, ...ports.splice(0, calUnitSize-1)];
    }
    else {
      vnaPorts = [commonPort, ...ports.splice(0)];
    }
    steps.push(vnaPorts.map(createCalUnitMap()));
  }
  return steps;
}

module.exports = {
  Choices: Choices,
  createSteps: createSteps
};
