class PageIndex {
  constructor(initialPage='null', initialStep=0) {
    this.page = initialPage;
    this.step = initialStep;
  }

  copy() {
    let index  = new PageIndex();
    index.page = this.page;
    index.step = this.step;
    return index;
  }
}

module.exports = PageIndex;
