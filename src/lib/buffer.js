class Buffer {
	constructor() {
		var text;
		this.reset();
		this.writeLambda = (text) => {
			this.append(text);
		};
	}
	append(text) {
		this.text = this.text + text;
	}
	reset() {
		this.text = '';
	}
}

module.exports = Buffer;
