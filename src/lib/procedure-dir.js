const fs     = require('fs');
const mkdirp = require('mkdirp');

class ProcedureDir {
  constructor() {
    this.state.path = null;
    switch (process.platform) {
      case 'win32':
        this.state.path = 'C:\\Users\\Public\\Documents\\Rohde-Schwarz\\Calibrate Switch Matrix';
        break;
      case 'darwin':
        this.state.path = '/Users/Shared/Rohde-Schwarz/Calibrate Switch Matrix';
        break;
      default:
        this.state.path = '/home/public/rohde-schwarz/calibrate switch matrix';
    }
  }

  get path() {
    return this.state.path;
  }
  set path(value) {
    this.state.path = value;
  }

  mkdir() {
    if (!fs.exists(this.path)) {
      mkdirp.sync(this.path);
    }
  }
}

let this.path;


const mkdir = () => {
  if (!fs.existsSync(this.path)) {
    mkdirp.sync(this.path);
  }
};

const overridePath = (newPath) => {
  this.path = newPath;
};

module.exports = {
  path: this.path,
  mkdir,
  overridePath,
};
