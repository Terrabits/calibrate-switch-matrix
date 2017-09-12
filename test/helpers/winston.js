class Winston {
  constructor() {
    this.contents = {
      error:   [],
      warn:    [],
      info:    [],
      verbose: [],
      debug:   [],
      silly:   []
    };
  }

  log(level, message, meta={}) {
    switch (String(level).toLowerCase) {
      case 'error':
        this.error(message, meta);
        break;
      case 'warn':
        this.warn(message, meta);
        break;
      case 'info':
        this.info(message, meta);
        break;
      case 'verbose':
        this.verbose(message, meta);
        break;
      case 'debug':
        this.debug(message, meta);
        break;
      case 'silly':
        this.silly(message, meta);
        break;
      default:
        this.debug(message, meta);
    }
  }
  error(message, meta={}) {
    this.contents.error.push(  {message, meta});
  }
  warn(message, meta={}) {
    this.contents.warn.push(   {message, meta});
  }
  info(message, meta={}) {
    this.contents.info.push(   {message, meta});
  }
  verbose(message, meta={}) {
    this.contents.verbose.push({message, meta});
  }
  debug(message, meta={}) {
    this.contents.debug.push(  {message, meta});
  }
  silly(message, meta={}) {
    this.contents.silly.push(  {message, meta});
  }
}

module.exports = new Winston();
