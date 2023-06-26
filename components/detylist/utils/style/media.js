class MediaArray {
	constructor (...val) {
		this._val = val;
	};

  map (fn) {
    return new MediaArray(...this._val.map((v, ...args) => {
      if (v === "#") { return "#"; }
      return fn(v, ...args);
    }));
  }

	getVal (mediaSize) {
		if (Array.isArray(this._val)) {
			if (this._val.length === 0) { return ""; }
			const _mediaSize = (mediaSize >= this._val.length) ? this._val.length - 1 : mediaSize;
			for (let _i = _mediaSize; _i >= 0; _i--) {
				if (this._val[_i] !== "#") { return this._val[_i]; }	
			}

			throw new RangeError(`There is no previous value to reference at index=${mediaSize}, please provide value at 0 index`);
		}

		return this._val;
	};

  toJSON () {
    return [...this._val];
  }

  toString() {
    return this._val.toString();
  }
};

export default MediaArray;
