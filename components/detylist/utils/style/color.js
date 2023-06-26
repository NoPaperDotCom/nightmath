class Color {
	constructor (val = {}) {
    const { h = 0, s = 0, l = 0, a= 1, radial = false, deg = 0, count = 1 } = val;
		this._h = h;
		this._s = s;
		this._l = l;
    this._a = a;
		this._deg = deg;
		this._radial = radial;
		this._count = count;
	};

  get raw () {
    const _val = (v) => (Array.isArray(v)) ? (v.length > 0) ? v[0] : 0 : v;
    return new Color({ h: _val(this._h), s: _val(this._s), l: _val(this._l), a: _val(this._a) });
  }

  get isMultiColor () {
    if (Array.isArray(this._h) && this._h.length > 0) { return true; }
    if (Array.isArray(this._s) && this._s.length > 0) { return true; }
    if (Array.isArray(this._l) && this._l.length > 0) { return true; }
    if (Array.isArray(this._a) && this._a.length > 0) { return true; }
    return false;
  };

  addBrightness (val /* - dark, + light */) {
    if (Array.isArray(this._l)) { this._l = this._l.map(l => l + val); }
    else { this._l += val; }
    return this;
  }

  addSaturation (val /* - much clear, + less clear */) {
    if (Array.isArray(this._s)) { this._s = this._s.map(s => s - val); }
    else { this._s += val; }
    return this;
  }

  addOpacity (val /* - less opacity, + much opacity */) {
    if (Array.isArray(this._a)) { this._a = this._a.map(a => a + val); }
    else { this._a += val; }
    return this;
  }

	getVal (baseColor = { h: 0, s: 0, l: 0}) {
    const _createColorValue = (bh, bv, bl, hv, sv, lv, av) => {
      let _nh = (bh + hv) % 360;
      let _ns = bv + sv;
      let _nl = bl + lv;
      let _av = (av < 0) ? 0 : (av > 1) ? 1 : av;
      _nh = (_nh < 0) ? 360 + _nh : _nh;
      _ns = (_ns < 0) ? 0 : (_ns > 1) ? 1 : _ns;
      _nl = (_nl < 0) ? 0 : (_nl > 1) ? 1 : _nl; 
      return `hsla(${_nh},${_ns * 100}%,${_nl * 100}%,${_av})`;
    };

    const { h = 0, s = 0, l = 0 } = baseColor; 
    let _maxLen = (Array.isArray(this._h)) ? this._h.length : 0;
    if (Array.isArray(this._s) && this._s.length > _maxLen) { _maxLen = this._s.length; }
    if (Array.isArray(this._l) && this._l.length > _maxLen) { _maxLen = this._l.length; }
    if (Array.isArray(this._a) && this._a.length > _maxLen) { _maxLen = this._a.length; }

    if (_maxLen === 0) {
      const _h = (Array.isArray(this._h) && this._h.length === 0) ? 0 : this._h;
      const _s = (Array.isArray(this._s) && this._s.length === 0) ? 0 : this._s;
      const _l = (Array.isArray(this._l) && this._l.length === 0) ? 0 : this._l;
      const _a = (Array.isArray(this._a) && this._a.length === 0) ? 0 : this._a;
      return _createColorValue(h, s, l, _h, _s, _l, _a);
    }

    const _colors = [];
    const _val = (v, idx) => (!Array.isArray(v)) ? v : (idx >= v.length) ? v[v.length - 1] : v[idx];
    for (let _i=0;_i<_maxLen;_i++) {
      const _h = _val(this._h, _i);
      const _s = _val(this._s, _i);
      const _l = _val(this._l, _i);
      const _a = _val(this._a, _i);
      _colors.push(_createColorValue(h, s, l, _h, _s, _l, _a));
    }

    if (this._radial) {
      return (this._count <= 1) ? `radial-gradient(circle at ${this._deg}%,${_colors.join(",")})` : `repeating-radial-gradient(circle at ${this._deg}%,${_colors.join(",")} ${100/this._count}%)`;
    }

    return (this._count <= 1) ? `linear-gradient(${this._deg}deg,${_colors.join(",")})` : `repeating-linear-gradient(${this._deg}deg,${_colors.join(",")} ${100/this._count}%)`;
	};

  toJSON () {
    return { color: `${this._h.toString()}${this._s.toString()}${this._l.toString()}${this._a.toString()}${(this._radial) ? "r" : "l"}${this._deg}${this._count}` };
  };
};

export default Color;
