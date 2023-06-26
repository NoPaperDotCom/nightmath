import MediaArray from "./media.js";
import Color from "./color.js";

const _convertBoolean = (val, stringForTrue, stringForFalse) => (val !== null && typeof val !== "boolean") ? val.toString() : (!val) ? stringForFalse : stringForTrue;

const _convertValFromBaseVal = (val, baseVal = false, unit = "px") => {
  if (val === true) { return (!baseVal) ? "inherit" : `${baseVal}${unit}`; }
  if (typeof val === "number") { return (!baseVal) ? `${val}${unit}` : `${val * baseVal}${unit}`; }
  return val.toString();
};

const _convertNumber = (val, unit = "") => {
  if (val === true) { return "auto"; }
  if (typeof val === "number" && val !== 0) { return `${(unit === "%") ? val * 100 : val}${unit}`; }
  return val.toString();
};

const _convertLineStyle = (ch) => {
  if (ch === true || ch === "-") { return "solid"; }
  if (ch === "--") { return "dashed"; }
  if (ch === ".") { return "dotted"; }
  if (ch === "=") { return "double"; }
  if (ch === "(") { return "wavy"; }
  if (ch === "") { return "none"; }
  return ch.toString();
};

const _convertColor = (val, colorPalette, baseColor) => {
  if (val === true) { return (!baseColor) ? "inherit" : (new Color()).getVal(baseColor); }
  if (val instanceof Color) { return val.getVal(baseColor); }
  if (val instanceof Object) { return (new Color(val)).getVal(baseColor); }

  const _val = val.toString();
  if (_val === "") { return "transparent"; }
  if (_val in colorPalette) { return _convertColor(colorPalette[_val], colorPalette, baseColor); }
  return _val;
};

const _convertKeyValPairStyle = (key, val, baseTheme, prevStyle) => {
  // filter unknown value
  if (val === null || val === undefined) { return {}; }

  // common
  if (key === "display") { return { display: (val === false) ? "none" : (val === true) ? "flex" : val.toString() }; }
	if (key === "userSelect") { return { userSelect: _convertBoolean(val, "auto", "none") }; }
  if (key === "appearance") { return (!val) ? { appearance: "none" } : {}; }
  if (key === "flexWrap") { return { flexWrap: _convertBoolean(val, "wrap", "nowrap") }; }

  // location
  if (key === "location" || key === "-location") {
    if (val === false) { return {}; } 
    const _x = (key === "location") ? "left" : "right";
    const _y = (key === "location") ? "top" : "bottom";
    const _val = (typeof val === "string") ? val.split(",") : val;
    if (Array.isArray(_val)) {
      if (_val.length === 0) { return {}; }
      if (_val.length === 1) {
        return { 
          [_x]: _convertNumber(_val[0], "%"),
          [_y]: _convertNumber(_val[0], "%")
        };
      }
      if (_val.length === 2) {
        return { 
          [_x]: _convertNumber(_val[0], "%"),
          [_y]: _convertNumber(_val[1], "%")
        };
      }
      if (_val.length >= 3) {
        return { 
          [_x]: _convertNumber(_val[0], "%"),
          [_y]: _convertNumber(_val[1], "%"),
          zIndex: parseInt(_val[2], 10)
        };
      }
    }

    return { 
      [_x]: _convertNumber(_val, "%"),
      [_y]: _convertNumber(_val, "%")
    };
  }

  if (key === "top" || key === "left" || key === "right" || key === "bottom") {
    if (val === false) { return {}; }
    return { [key]: _convertNumber(val, "%") };
  }

  if (key === "fullscreen") {
    if (val === false) { return {}; }
    return { left: 0, top: 0, right: 0, bottom: 0, zIndex: (val === true) ? 0 : parseInt(val, 10) };
  }

  if (key === "zIndex") {
    if (val === false) { return {}; }
    return { [key]:  parseInt(val, 10) };
  }

  if (key === "fixed") {
    return { position: _convertBoolean(val, "fixed", "absolute") };
  }

  // overflow
  if (key === "overflow") {
    const _val = (typeof val === "string") ? val.split(",") : val;    
    if (Array.isArray(_val)) {
      if (_val.length === 0) { return {}; }
      if (_val.length === 1) { return { overflow: _convertBoolean(_val[0], "auto", "hidden") }; }
      if (_val.length >= 2) {
        return {
          overflowX: _convertBoolean(_val[0], "auto", "hidden"),
          overflowY: _convertBoolean(_val[1], "auto", "hidden"),
        };
      }
    }

    return { [key]: _convertBoolean(val, "auto", "hidden") };
  }

  if (key === "overflowX" || key === "overflowY") {
    return { [key]: _convertBoolean(val, "auto", "hidden") };
  }

  // dimension
  if (key === "size" || key === "minSize" || key === "maxSize") {
    if (val === false) { return {}; }
    const _width = (key === "size") ? "width" : key.replace("Size", "Width");
    const _height = (key === "size") ? "height" : key.replace("Size", "Height");
    const _val = (typeof val === "string") ? val.split(",") : val;
    
    if (Array.isArray(_val)) {
      if (_val.length === 0) { return {}; }
      if (_val.length === 1) {
        return { 
          [_width]: _convertNumber(_val[0], "%"),
          [_height]: _convertNumber(_val[0], "%")
        };
      }
      if (_val.length >= 2) {
        if (_val[0] === "s" || _val[0] === "S") { return { aspectRatio: "1 / 1", [_height]: _convertNumber(_val[1], "%") }; }
        if (_val[1] === "s" || _val[1] === "S") { return { aspectRatio: "1 / 1", [_width]: _convertNumber(_val[0], "%") }; }
        if (_val[0] === "r" || _val[0] === "R") { return { aspectRatio: "2 / 1", [_height]: _convertNumber(_val[1], "%") }; }
        if (_val[1] === "r" || _val[1] === "R") { return { aspectRatio: "2 / 1", [_width]: _convertNumber(_val[0], "%") }; }
        if (_val[0] === "v" || _val[0] === "V") { return { aspectRatio: "16 / 9", [_height]: _convertNumber(_val[1], "%") }; }
        if (_val[1] === "v" || _val[1] === "V") { return { aspectRatio: "16 / 9", [_width]: _convertNumber(_val[0], "%") }; }

        return { 
          [_width]: _convertNumber(_val[0], "%"),
          [_height]: _convertNumber(_val[1], "%")
        };
      }
    }

    return { 
      [_width]: _convertNumber(_val, "%"),
      [_height]: _convertNumber(_val, "%")
    };
  }

  if (key === "height" || key === "width") {
    if (val === false) { return {}; }
    return { [key]: _convertNumber(val, "%") };
  }

  // spacing
  if (key === "padding" || key === "margin" || key === "scrollPadding") {
    if (val === false) { return {}; }
    const _val = (typeof val === "string") ? val.split(",") : val;
    if (Array.isArray(_val)) {
      if (_val.length === 0) { return {}; }
      if (_val.length === 1) { return { [key]: _convertValFromBaseVal(_val[0], baseTheme.spacing) }; }
      if (_val.length >= 2 && _val.length < 4) {
        return {
          [`${key}Left`]: _convertValFromBaseVal(_val[0], baseTheme.spacing),
          [`${key}Right`]:  _convertValFromBaseVal(_val[0], baseTheme.spacing),
          [`${key}Top`]:  _convertValFromBaseVal(_val[1], baseTheme.spacing),
          [`${key}Bottom`]:  _convertValFromBaseVal(_val[1], baseTheme.spacing)				
        };
      }
      if (_val.length >= 4) {
        return {
          [`${key}Top`]: _convertValFromBaseVal(_val[0], baseTheme.spacing),
          [`${key}Right`]:  _convertValFromBaseVal(_val[1], baseTheme.spacing),
          [`${key}Bottom`]:  _convertValFromBaseVal(_val[2], baseTheme.spacing),
          [`${key}Left`]:  _convertValFromBaseVal(_val[3], baseTheme.spacing)				
        };
      }
    }

    return { [key]: _convertValFromBaseVal(_val, baseTheme.spacing) }; 
  }

  if (key === "paddingLeft" || key === "marginLeft" || key === "scrollPaddingLeft" ||
      key === "paddingRight" || key === "marginRight" || key === "scrollPaddingRight" ||
      key === "paddingTop" || key === "marginTop" || key === "scrollPaddingTop" ||
      key === "paddingBottom" || key === "marginBottom" || key === "scrollPaddingBottom" || key === "gap")
  { return (val === false) ? {} : { [key]: _convertValFromBaseVal(val, baseTheme.spacing) }; }

  // item location
  if (key === "itemPosition") {
    if (val === false) { return {}; }
    const _getValue = (v) => {
      if (v === "start" || v === "end") { return `flex-${v}`};
      return "center";
    }

    const _val = (typeof val === "string") ? val.split(",") : val;  
    const _style = {};
    if (Array.isArray(_val)) {
      if (_val.length === 1) {
        _style["justifyContent"] = _getValue(_val[0]);
        _style["alignItems"] = _getValue(_val[0]); 
      } else if (val.length >= 2) {
        _style["justifyContent"] = _getValue(_val[0]);
        _style["alignItems"] = _getValue(_val[1]); 
      }
    } else {
      _style["justifyContent"] = _getValue(_val);
      _style["alignItems"] = _getValue(_val);
    }

    return _style;
  }

  if (key === "align") {
    if (val === false) { return {}; }
    const _getValue = (v, h) => {
      if (v === "start" && h) { return "left"; }
      if (v === "end" && h) { return "right"; }
      if (v === "center" && h) { return "center"; }
      if (v === "start" && !h) { return "top"; }
      if (v === "end" && !h) { return "bottom"; }
      if (v === "center" && !h) { return "middle"; }
      return v;
    }

    const _val = (typeof val === "string") ? val.split(",") : val;  
    const _style = {};
    if (Array.isArray(_val)) {
      if (_val.length === 1) {
        _style["textAlign"] = _getValue(_val[0], true);
        _style["verticalAlign"] = _getValue(_val[0], false); 
      } else if (val.length >= 2) {
        _style["textAlign"] = _getValue(_val[0], true);
        _style["verticalAlign"] = _getValue(_val[1], false); 
      }
    } else {
      _style["textAlign"] = _getValue(_val, true);
      _style["verticalAlign"] = _getValue(_val, false);
    }

    return _style;
  }

  // background
  if (key === "background") {
    if (val === false) { return {}; }
    if (val instanceof Color) { return { background: val.getVal(baseTheme.color) }; }
    if (val instanceof Object) { return { background: (new Color(val)).getVal(baseTheme.color) }; }

    const _val = val.toString();
    if (_val.length === 0) { return { backgroundColor: "transparent" }; }
    return {
      backgroundImage: `url(${_val})`,
      backgroundRepeat: "no-repeat",
      backgroundAttachment: "fixed",
      backgroundPosition: "center",
      backgroundSize: "cover"
    };
  }

  if (key === "backgroundRepeat") {
    if (val === false) { return { [key]: "no-repeat" }; }
    if (val === true) { return { [key]: "repeat" }; }
    if (val === "x" || val === "X") { return { [key]: "repeat-x" }; }
    if (val === "y" || val === "Y") { return { [key]: "repeat-y" }; }
    if (val.toLowerCase() === "xy" || val.toLowerCase() === "yx") { return { [key]: "repeat" }; }
    return { [key]: val.toString() };
  }

  if (key === "backgroundFixed") {
    return { backgroundAttachment: _convertBoolean(val, "fixed", "scroll") };
  }

  if (key === "backgroundPosition" || key === "backgroundSize" || key === "objectPosition") {
    if (val === false) { return {}; }
    const _val = (typeof val === "string") ? val.split(",") : val;
    if (Array.isArray(_val)) {
      if (_val.length === 0) { return {}; }
      if (_val.length === 1) { return { [key]: `${_convertNumber(_val[0], "%")}` }; }
      if (_val.length >= 2) { return { [key]: `${_convertNumber(_val[0], "%")} ${_convertNumber(_val[1], "%")}` }; }
    }

    return { [key]: (_val === true) ? ((_val === "backgroundPosition") ? "center" : "contain") : _val.toString() };
  }

  if (key === "backgroundImage") {
    if (val === false) { return {}; }
    const _val = val.toString();
    if (_val.length === 0) { return {}; }
    return { backgroundImage: `url(${_val})` };
  }

  if (key === "backgroundColor") {
    if (val === false) { return {}; }
    if (val instanceof Object) {
      const _val = (val instanceof Color) ? val : new Color(val);
      if (_val.isMultiColor) { return { background: _val.getVal(baseTheme.color) }; }
      return { [key]: _val.getVal(baseTheme.color) };
    }

    return { [key]: _convertColor(val, baseTheme.colorPalette, baseTheme.color) };
  }

  // shape
  if (key === "square") {
    if (val === false) { return {}; }
    return { aspectRatio: _convertBoolean(val, "1 / 1", "auto") }
  }

  if (key === "radius" || key === "borderRadius" || key === "rounded") {
    if (val === false) { return {}; }
    const _dr = [0, 10, 9999999];
    const _convert = (v) => (v === "[" || v === "]") ? _dr[0] : (v === "{" || v === "}") ? _dr[1] : (v === "(" || v === ")") ? _dr[2] : _convertValFromBaseVal(v, baseTheme.radius);
    const _setStyle = (tl, tr, br, bl) => ({
      borderTopLeftRadius: tl,
      borderTopRightRadius: tr,
      borderBottomRightRadius: br,
      borderBottomLeftRadius: bl
    });

    if (val === "[]") { return { borderRadius: _dr[0] }; }
    if (val === "[}") { return _setStyle(_dr[0], _dr[1], _dr[1], _dr[0]); }
    if (val === "[)") { return _setStyle(_dr[0], _dr[2], _dr[2], _dr[0]); }

    if (val === "{]") { return _setStyle(_dr[1], _dr[0], _dr[0], _dr[1]); }
    if (val === "{}") { return { borderRadius: _dr[1] }; }
    if (val === "{)") { return _setStyle(_dr[1], _dr[2], _dr[2], _dr[1]); }

    if (val === "(]") { return _setStyle(_dr[2], _dr[0], _dr[0], _dr[2]); }
    if (val === "(}") { return _setStyle(_dr[2], _dr[1], _dr[1], _dr[2]); }
    if (val === "()") { return { borderRadius: _dr[2] }; }
 
    const _val = (typeof val === "string") ? val.split(",") : val;
    if (Array.isArray(_val)) {
      if (_val.length === 0) { return {}; }
      if (_val.length === 1) { return { borderRadius: _convert(_val[0]) }; }
      if (_val.length === 2) { return _setStyle(_convert(_val[0]), _convert(_val[1]), _convert(_val[1]), _convert(_val[0])); }
      if (_val.length === 3) { return _setStyle(_convert(_val[0]), _convert(_val[1]), _convert(_val[2]), _convert(_val[0])); }
      if (_val.length >= 4) { return _setStyle(_convert(_val[0]), _convert(_val[1]), _convert(_val[2]), _convert(_val[3])); }
    }
    
    return { borderRadius: _convertValFromBaseVal(_val, baseTheme.radius) };
  }

  if (key === "borderTopLeftRadius" || key === "borderTopRightRadius" || key === "borderBottomRightRadius" || key === "borderBottomLeftRadius") {
    return (val === false) ? {} : { [key]: _convertValFromBaseVal(val, baseTheme.radius) };
  }

  // border / outline convertion
  if (key === "border" || key === "borderTop" || key === "borderRight" || key === "borderRight" || key === "borderBottom" || key === "outline") {
    if (val === false) { return {}; }
    const _lineStyle = (k, v) => {
      if (v instanceof Color) { return { [`${k}Style`]: "solid", [`${k}Color`]: v.getVal(baseTheme.color) }; }
      if (Array.isArray(v)) {
        const [t = "-", c = true, w = 1 ] = v;
        const _style = {};
        _style[`${k}Style`] = _convertLineStyle(t);
        _style[`${k}Color`] = _convertColor(c, baseTheme.colorPalette, baseTheme.color);
        _style[`${k}Width`] = _convertValFromBaseVal(w, baseTheme.thickness);
        return _style;
      }
      if (v instanceof Object) {
        const { t = "-", c = true, w = 1 } = v;
        const _style = {};
        _style[`${k}Style`] = _convertLineStyle(t);
        _style[`${k}Color`] = _convertColor(c, baseTheme.colorPalette, baseTheme.color);
        _style[`${k}Width`] = _convertValFromBaseVal(w, baseTheme.thickness);
        return _style;
      }

      if (typeof v === "number") { return { [`${k}Style`]: "solid", [`${k}Width`]: _convertValFromBaseVal(v, baseTheme.thickness) }; }
      return { [`${k}Style`]: _convertLineStyle(v) };
    };

    if (key !== "border") { return _lineStyle(key, val); }
    const _val = (typeof val === "string") ? val.split(",") : val;
    if (Array.isArray(_val)) {
      if (_val.length === 0) { return {}; }
      if (_val.length === 1) { return _lineStyle(key, val); }
      if (_val.length >= 2 && _val.length < 4) {
        return {
          ..._lineStyle("borderLeft", _val[0]),
          ..._lineStyle("borderRight", _val[0]),
          ..._lineStyle("borderTop", _val[1]),
          ..._lineStyle("borderBottom", _val[1])
        };
      }
      if (_val.length >= 4) {
        return {
          ..._lineStyle("borderTop", _val[0]),
          ..._lineStyle("borderRight", _val[1]),
          ..._lineStyle("borderBottom", _val[2]),
          ..._lineStyle("borderLeft", _val[3])				
        };
      }
    }

    return _lineStyle(key, val);
  }
  
  if ((key.indexOf("border") !== -1 || key.indexOf("outline") !== -1) && key.indexOf("Style") !== -1) {
    if (val === false) { return {}; }
    return { [key]: _convertLineStyle(val) };
  }

  if ((key.indexOf("border") !== -1 || key.indexOf("outline") !== -1 ) && key.indexOf("Width") !== -1) {
    if (val === false) { return {}; }
    return { [key]: _convertValFromBaseVal(val, baseTheme.thickness) };
  }

  if (((key.indexOf("border") !== -1 || key.indexOf("outline") !== -1) && key.indexOf("Color") !== -1) || key === "caretColor" || key === "accentColor") {
    if (val === false) { return {}; }
    return { [key]: _convertColor(val, baseTheme.colorPalette, baseTheme.color) }
  }

  if (key === "outlineOffset") {
    if (val === false) { return {}; }
    return { [key]: _convertValFromBaseVal(val, baseTheme.spacing) };
  }

  // font
  if (key === "fontColor" || key === "color") {
    if (val === false) { return {}; }
    if (val instanceof Object) {
      const _val = (val instanceof Color) ? val : new Color(val);
      if (_val.isMultiColor) {
        return {
          backgroundColor: _val.raw.getVal(baseTheme.color),
          WebkitTextFillColor: "transparent",
          MozTextFillColor: "transparent",
          WebkitBackgroundClip: "text",
          MozBackgroundClip: "text",
          backgroundImage: _val.getVal(baseTheme.color),
          backgroundSize: "100%"
        }
      } else {
        return { color: _val.getVal(baseTheme.color) };
      }
    }
    
    return { color: _convertColor(val, baseTheme.colorPalette, baseTheme.color) };
  }

  if (key === "fontImage") {
    if (val === false) { return {}; }    
    return {
      backgroundColor: "#ffffff",
      WebkitTextFillColor: "transparent",
      MozTextFillColor: "transparent",
      WebkitBackgroundClip: "text",
      MozBackgroundClip: "text",
      backgroundImage: `url(${val.toString()})`,
      backgroundSize: "100%"
    };
  }

  if (key === "fontBackground") {
    if (val === false) { return {}; }
    if (val instanceof Object) {
      const _val = (val instanceof Color) ? val : new Color(val);
      if (_val.isMultiColor) {
        return {
          backgroundColor: _val.raw.getVal(baseTheme.color),
          WebkitTextFillColor: "transparent",
          MozTextFillColor: "transparent",
          WebkitBackgroundClip: "text",
          MozBackgroundClip: "text",
          backgroundImage: _val.getVal(baseTheme.color),
          backgroundSize: "100%"
        }
      } else {
        return { color: _val.getVal(baseTheme.color) };
      }
    }

    return {
      backgroundColor: "#ffffff",
      WebkitTextFillColor: "transparent",
      MozTextFillColor: "transparent",
      WebkitBackgroundClip: "text",
      MozBackgroundClip: "text",
      backgroundImage: `url(${val.toString()})`,
      backgroundSize: "100%"
    };
  }

  if (key === "fontFamily") {
    if (typeof val !== "string") { return {}; }
    return { fontFamily: `${val.toString()}${(val.length === 0) ? "" : ","}Arial,Helvetica,cursive,sans-serif` };
  }

  if (key === "fontSize" || key === "fontWeight") {
    if (val === false) { return {}; }
    return { [key]: _convertValFromBaseVal(val, baseTheme[key], (key === "fontWeight") ? "" : "px") };
  }

  if (key === "letterSpacing" || key === "lineHeight") {
    if (val === false) { return {}; }
    return { [key]: _convertValFromBaseVal(val, baseTheme[(key === "letterSpacing") ? "spacing" : "fontSize"]) };
  }

  if (key === "textShadow") {
    if (val === false) { return {}; }
    if (val instanceof Color) { return { textShadow: `${val.getVal(baseTheme.color)} 5px 0 20px` }; }
    if (val instanceof Object) { return { textShadow: `${(new Color(val)).getVal(baseTheme.color)} 5px 0 20px` }; }
    if (val === true) { return { textShadow: "rgba(0,0,0,0.2) 5px 0 20px" }; }
    return { textShadow: val.toString() };
  }

	if (key === "italic") {
    return { fontStyle: (!val) ? "normal" : "italic" };
  }

  if (key === "fontFill") {
    return { fontVariationSettings: (!val) ? "'FILL' 0" : "'FILL' 1" };
  }

  if (key === "underline" || key === "overline" || key === "lineThrough") {
    if (!val) { return  {}; }
    const _prevLine = (prevStyle.hasOwnProperty("textDecorationLine")) ? `${prevStyle.textDecorationLine} ` : "";
    const _key = (key === "lineThrough") ? "line-through" : key;
    return { textDecorationLine: `${_prevLine}${_key}` };
  }

  if (key === "fontLine") {
    if (val === false) { return {}; }
    if (val instanceof Color) { return { textDecorationColor: val.getVal(baseTheme.color) }; }
    if (Array.isArray(val)) {
      const [t = "solid", c = "", w = 1 ] = val;
      const _style = {};
      _style.textDecorationStyle = _convertLineStyle(t);
      _style.textDecorationColor = _convertColor(c, baseTheme.colorPalette, baseTheme.color);
      _style.textDecorationThickness = _convertValFromBaseVal(w, baseTheme.thickness);
      return _style;
    }
    if (val instanceof Object) {
      const { t = "solid", c = "", w = 1 } = val;
      const _style = {};
      _style.textDecorationStyle = _convertLineStyle(t);
      _style.textDecorationColor = _convertColor(c, baseTheme.colorPalette, baseTheme.color);
      _style.textDecorationThickness = _convertValFromBaseVal(w, baseTheme.thickness);
      return _style;
    }
    
    if (typeof val === "number") { return { textDecorationThickness: _convertValFromBaseVal(val, baseTheme.thickness) }; }
    return { textDecorationStyle: _convertLineStyle(val) };
  }

  if (key === "truncate") {
    if (!val) { return {}; }
    return {
      overflow: "hidden",
      textOverflow: 'ellipsis " [...]"',
      whiteSpace: "nowrap"
    }
  }

  if (key === "textDecorationStyle") {
    if (val === false) { return {}; }
    return { [key]: _convertLineStyle(val) };
  }

  if (key === "textUnderlineOffset" || key === "textDecorationThickness") {
    if (val === false) { return {}; }
    return { [key]: _convertValFromBaseVal(val, baseTheme[(key === "textUnderlineOffset") ? "spacing" : "thickness"]) };
  }

  if (key === "textDecorationColor") {
    if (val === false) { return {}; }
    if (val instanceof Color) { return { [key]: val.getVal(baseTheme.color) }; }
    if (val instanceof Object) { return { [key]: (new Color(val)).getVal(baseTheme.color) }; }
    return { [key]: (val === true) ? "currentColor" : (val === "") ? "transparent" : val.toString() }
  }
  
  // svg
  if (key === "stroke" || key === "fill") {
    if (val === false) { return {}; }
    return { [key]: _convertColor(val, baseTheme.colorPalette, baseTheme.color) };
  }

  if (key === "strokeWidth") {
    if (val === false) { return {}; }
    return { strokeWidth: _convertValFromBaseVal(val, baseTheme.thickness) };
  }

  if (key === "svgSize") {
    if (val === false) { return {}; }
    return { width: _convertValFromBaseVal(val, baseTheme.fontSize), height: _convertValFromBaseVal(val, baseTheme.fontSize) };
  }

  // transform
  if (key === "translate" || key === "rotate" || key === "scale" || key === "skew") {
    if (val === false) { return {}; }
    const _prevVal = (prevStyle.hasOwnProperty("transform")) ? `${prevStyle.transform} ` : "";
    const _f = (v, is3d = true, u = "%" ) => {
      if (key === "rotate") { return [`${key}(${_convertNumber(v, u)})`]; }

      const _v = (Array.isArray(v)) ? v : [v];
      if (_v.length === 0) { return []; }
      if (_v.length === 1) { return [`${key}X(${_convertNumber(_v[0], u)})`, `${key}Y(${_convertNumber(_v[0], u)})`]; }
      if (_v.length === 2) { return [`${key}X(${_convertNumber(_v[0], u)})`, `${key}Y(${_convertNumber(_v[1], u)})`]; }
      if (_v.length >= 3) {
        if (is3d) { return [`${key}X(${_convertNumber(_v[0], u)})`, `${key}Y(${_convertNumber(_v[1], u)})`, `${key}Z(${_convertNumber(_v[2], u)})`]; }
        return [`${key}X(${_convertNumber(_v[0], u)})`, `${key}Y(${_convertNumber(_v[1], u)})`];
      }

      return [];
    };

    const _val = (key === "translate") ? _f(val) : (key === "rotate") ? _f(val, true, "deg") : (key === "scale") ? _f(val, false) : _f(val, false);
    return { transform: `${_prevVal}${_val.join(" ")}` };
  }

  if (key === "transform") {
    if (typeof key !== "string") { return {}; }
    const _prevVal = (prevStyle.hasOwnProperty("transform")) ? `${prevStyle.transform} ` : "";
    return { transform: `${_prevVal}${val.toString()}` };
  }

  // effect
  if (key === "shadow") {
    if (!val) { return {}; }
    if (val === true) { return { boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.25)" }; }
    const _val = _convertValFromBaseVal(val, baseTheme.thickness);
    return { boxShadow: `${_val} ${_val} 5px 3px rgba(0, 0, 0, 0.2)` };
  }

  if (key === "blur") {
    if (!val) { return {}; }
    const _prevVal = (prevStyle.hasOwnProperty("filter")) ? `${prevStyle.filter} ` : "";
    return { filter: `${_prevVal}blur(${_convertValFromBaseVal(val, baseTheme.thickness)})` }
  }

  if (key === "invert" || key === "brightness" || key === "contrast" || key === "grayScale" || key === "saturate" || key === "sepia") {
    if (!val) { return {}; }
    const _prevVal = (prevStyle.hasOwnProperty("filter")) ? `${prevStyle.filter} ` : "";
    return { filter: `${_prevVal}${key.toLowerCase()}(${_convertNumber(val, "%")})` }
  }

  if (key === "alpha") {
    if (!val) { return {}; }
    const _prevVal = (prevStyle.hasOwnProperty("filter")) ? `${prevStyle.filter} ` : "";
    return { filter: `${_prevVal}opacity(${_convertNumber(val, "deg")})` }
  }

  if (key === "hueRotate") {
    if (!val) { return {}; }
    const _prevVal = (prevStyle.hasOwnProperty("filter")) ? `${prevStyle.filter} ` : "";
    return { filter: `${_prevVal}hue-rotate(${_convertNumber(val, "deg")})` }
  }

  if (key === "filter") {
    if (!val) { return {}; }
    const _prevVal = (prevStyle.hasOwnProperty("filter")) ? `${prevStyle.filter} ` : "";
    return { filter: `${_prevVal}${val.toString()}` }
  }

  // animation
  if (key === "animate") {
    return { animationPlayState: _convertBoolean(val, "running", "paused") };
  }

  return (val === false) ? {} : { [key]: val };
};

const _getStyleValBasedonMediaSize = (val, mediaSize) => {
	if (val instanceof MediaArray) { return val.getVal(mediaSize); }
	return val;
};

export const convertStyle = (style = {}, mediaSize = 0, baseTheme = {}) => {
  let _style = {};
	Object.entries(style).forEach(([key, val]) => {
		const _val = _getStyleValBasedonMediaSize(val, mediaSize);
    _style = { ..._style, ..._convertKeyValPairStyle(key, _val, baseTheme, _style) };
		return;
	});
  
  return _style;
};

export const isM = (val) => val instanceof MediaArray;
export const M = (...val) => new MediaArray(...val);

export const isC = (val) => val instanceof Color;
export const C = (val) => new Color(val);

/*
  // grid
  if (key === "grid") {
    if (val === false) { return {}; }
    const _val = (typeof val === "string") ? val.split(",") : val;
    const _gridTemplate = (v) => {
      if (v === false) { return "none"; }
      if (v === true) { return "auto"; }
      if (Array.isArray(v)) {
        if (v.length === 0) { return "none"; }
        if (v.length === 1) { return (typeof v[0] === "number") ? `repeat(${parseInt(v[0], 10)}, 1fr)` : v[0].toString(); }
        if (v.length >= 2) {
          if (typeof v[0] === "number" && typeof v[1] === "number") {
            return `repeat(${parseInt(v[0], 10)}, minmax(${_convertNumber(v[1], "%")}, max-content))`;
          }
          if (typeof v[0] === "number" && typeof v[1] !== "number") {
            return `repeat(${parseInt(v[0], 10)}, ${v[1].toString()})`;
          }
          
          return v[0].toString();
        }
      }
      if (typeof v === "number") { return `repeat(${parseInt(v, 10)}, 1fr)`; }
      return v.toString();
    };

    if (Array.isArray(_val)) {
      if (_val.length === 0) { return {}; }
      if (_val.length === 1) { return { gridTemplateColumns: _gridTemplate(_val[0]), gridTemplateRows:  _gridTemplate(_val[0]) }; }
      if (_val.length >= 2) { return { gridTemplateColumns: _gridTemplate(_val[0]), gridTemplateRows:  _gridTemplate(_val[1]) }; }
    }

    return { gridTemplateRows: _gridTemplate(_val), gridTemplateColumns: _gridTemplate(_val) };
  }

  if (key === "gap") {
    if (val === false) { return {}; }    
    const _val = (typeof val === "string") ? val.split(",") : val;
    if (Array.isArray(_val)) {
      if (_val.length === 0) { return {}; }
      if (_val.length === 1) { return { gap: _convertValFromBaseVal(_val[0], baseTheme.spacing) }; }
      if (_val.length >= 2) { return { columnGap: _convertValFromBaseVal(_val[0], baseTheme.spacing), rowGap: _convertValFromBaseVal(_val[1], baseTheme.spacing) }; }
    }

    return { gap: _convertValFromBaseVal(val, baseTheme.spacing) };
  }

  if (key === "cell") {
    if (val === false) { return {}; }
    const _val = (typeof val === "string") ? val.split(",") : val;
    const _gridArea = (v, dir = "Row") => {
      const _v = (typeof v === "string") ? v.split(",") : v;
      if (Array.isArray(_v)) {
        if (_v.length === 0) { return {}; }
        if (_v.length === 1) {
          if (_v[0] === false) { return {}; }
          const _start = { [`grid${dir}Start`]: (_v[0] === true) ? "auto" : parseInt(_v[0], 10) + 1 };
          const _end = { [`grid${dir}End`]: "auto" };
          return { ..._start, ..._end };          
        }

        if (_v.length >= 2) {
          const _start = (_v[0] === false) ? {} : { [`grid${dir}Start`]: (_v[0] === true) ? "auto" : parseInt(_v[0], 10) + 1 };
          const _end = (_v[1] === false) ? {} : { [`grid${dir}End`]: (_v[1] === true) ? "auto" : parseInt(_v[1], 10) + 2 };
          return { ..._start, ..._end };
        }        
      }

      if (v === false) { return {}; }
      if (v === true) { return { [`grid${dir}`]: "auto / auto" }; }
      if (typeof v === "number") { return { [`grid${dir}Start`]: parseInt(v, 10) + 1, [`grid${dir}End`]: parseInt(v, 10) + 2 }; }
      return { [`grid${dir}`]: v.toString() };
    };

    if (Array.isArray(_val)) {
      if (_val.length === 0) { return {}; }
      if (_val.length === 1) { return { ..._gridArea(_val[0], "Column"), ..._gridArea(true, "Row") }; }
      if (_val.length === 2) { return { ..._gridArea(_val[0], "Column"), ..._gridArea(_val[1], "Row") }; }
      if (_val.length >= 3) { return { ..._gridArea(_val[0], "Column"), ..._gridArea(_val[1], "Row"), zIndex: parseInt(_val[2], 10) }; }
    }

    return { gridArea: (val === true) ? "auto / auto / auto / auto" : val.toString() }
  }
*/