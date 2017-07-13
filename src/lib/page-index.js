class PageIndex {
  constructor(initialPage='null', initialStep=0) {
    this.page = initialPage;
    this.step = initialStep;
    this.totalSteps = -1;
  }

  copy() {
    let index  = new PageIndex();
    index.page = this.page;
    index.step = this.step;
    index.totalSteps = this.totalSteps;
    return index;
  }
}

module.exports = PageIndex;
