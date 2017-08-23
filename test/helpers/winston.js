class Winston {
  constructor() {
    this.contents = {
      info: [],
      debug: [],
      error: []
    };
  }

  debug(text, meta={}) {
    this.contents.debug.push({text, meta});
  }
  info(text, meta={}) {
    this.contents.info.push({text, meta});
  }
  error(text, meta={}) {
    this.contents.error.push({text, meta});
  }
}

module.exports = new Winston();
