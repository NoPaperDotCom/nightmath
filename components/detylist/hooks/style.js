import React from "react";
import { convertStyle } from "./../utils";

const _toCssKey = (key) => {
  let _key = key;
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach(ch => {
    _key = _key.replaceAll(ch, `-${ch.toLowerCase()}`);  
    return;
  });

  return _key;
};

export const useStyle = (style, mediaSize, baseTheme) => {
	const _cachedStyles = React.useRef({});
	const _rawStyleJson = React.useRef("");
  const _json = JSON.stringify(style);
	if (_json !== _rawStyleJson.current) {
		_cachedStyles.current = {};
		_rawStyleJson.current = _json;
	}

	if (!_cachedStyles.current.hasOwnProperty(`${mediaSize}`)) {
		const _retStyle = convertStyle(style, mediaSize, baseTheme);
		_cachedStyles.current[`${mediaSize}`] = _retStyle;
	}

  return _cachedStyles.current[`${mediaSize}`];
};

const _keyframeNameSet = new Set();
export const useAnimation = (params = [] /* [{ keyframes: [], duration = 2, delay = 1, timeFunction = "ease-in-out", fillMode = "both", count = "infinite", alternate = false }, ... ] */, mediaSize, baseTheme) => {
	const _cachedStyles = React.useRef({});
	const _rawStyleJson = React.useRef("");

  const _params = (Array.isArray(params)) ? params : [params];
  if (_params.length > 0) {
    const _json = JSON.stringify(_params);
    if (_json !== _rawStyleJson.current) {
      _cachedStyles.current = {};
      _rawStyleJson.current = _json;
    }

    const _animationStyleVal = _params.map(({ keyframes = [], ...options }, i) => {
      if (keyframes.length === 0) { return ""; }
      let _prevKeyframe = null;
      const _keyframes = [];
      for (let _j = 0; _j < keyframes.length; _j++) {
        const _keyframe = keyframes[_j];
        if (_keyframe === "#") {
          if (!_prevKeyframe) { throw new RangeError(`There is no previous value to reference, please provide value at 0 index`); }
          _keyframes.push(_prevKeyframe);
        }
        
        if (!_cachedStyles.current.hasOwnProperty(`${i}${_j}${mediaSize}`)) {
          const _retStyle = convertStyle(_keyframe, mediaSize, baseTheme);
          _cachedStyles.current[`${i}${_j}${mediaSize}`] = _retStyle;     
        }

        _prevKeyframe = _cachedStyles.current[`${i}${_j}${mediaSize}`];
        _keyframes.push(_cachedStyles.current[`${i}${_j}${mediaSize}`]);          
      }

      const { duration = 2, delay = 1, timeFunction = "ease-in-out", fillMode = "both", count = "infinite", alternate = false } = options;
      const _name = JSON.stringify(_keyframes).match(/[\d\w]/g).join("");
      if (!_keyframeNameSet.has(_name)) {
        // create keyframe ...
        const _cssKeyframes = _keyframes.map((o, i) => {
          let _s = `${i * 100/(keyframes.length - 1)}% {`;
          Object.entries(o).forEach(([k, v]) => {
            const _key = _toCssKey(k);
            _s += `${_key}:${v};`;
            return;
          });

          _s += '}';
          return _s;
        });

        // create stylesheet for keyframes ...
        if (typeof window !== "undefined") {
          const _styleSheet = document.createElement('style');
          _styleSheet.type = 'text/css';
          _styleSheet.innerHTML = `@keyframes ${_name} { ${_cssKeyframes.join(" ")} }`;
          document.getElementsByTagName('head')[0].appendChild(_styleSheet);

          // mark in the set ...
          _keyframeNameSet.add(_name);
        }
      }

      return `${_name} ${duration}s ${timeFunction} ${delay}s ${count} ${(alternate) ? "alternate" : "normal"} ${fillMode}`;
    });

    if (_animationStyleVal.length > 0) { return { animation: _animationStyleVal.join(",") }; }
  }

  return {};
};

export const useTransition = (params = {}) => {
  const _vals = Object.entries(params).map(([k, o]) => {
    if (o instanceof Object && !Array.isArray(o) && o !== null) {
      const { duration = 2, timeFunction = "ease-in-out", delay = 0 } = o;
      return `${k} ${duration}s ${timeFunction} ${delay}s`;
    }

    return "";  
  }).filter(s => s.length > 0);

  if (_vals.length === 0) { return {}; }
  return { transition: _vals.join(",") };
};

export const useNodeStyle = (ref /* ref or element or id */, propNames = "width,height") => {
  const [_properties, _setProperties] = React.useState({});
  React.useEffect(() => {
    const _propNames = (Array.isArray(propNames)) ? propNames : propNames.toString().split(",");
    let _el = null;
    if (!ref) { _el = window; }  
    else if (ref === window || ref === document || ref instanceof Element) { _el = ref; }
    else if (ref instanceof Object && ref.hasOwnProperty("current")) {
      if (ref.current instanceof Element) { _el = ref.current; }
    } else if (typeof ref === "string" && ref.length > 0) {
      const _elById = document.getElementById(ref);
      if (_elById instanceof Element) { _el = _elById; }
    }

    let _mutationObserver = null;
    if (_el) {
      const _mutationCallback = () => {
        const _computedStyle = document.defaultView.getComputedStyle(_el, null);  
        _setProperties(old => {
          let _newProperties = false;
          _propNames.forEach(name => {
            const _value = _computedStyle.getPropertyValue(_toCssKey(name));
            if (old[name] !== _value) { _newProperties = (!_newProperties) ? { ...old, name: _value } : { ..._newProperties, name: _value }; }
            return;
          });

          return (_newProperties) ? _newProperties : old;
        });
      };

      _mutationCallback();
      _mutationObserver = new window.MutationObserver(_mutationCallback);
      _mutationObserver.observe(_el, { attributes: true, attributeFilter: ['style'] });
    }

    return () => {
      if (_mutationObserver && _el) {
        _mutationObserver.unobserve(_el);
        _mutationObserver.disconnect();
      }
      
      return true;
    };
  }, [ref, propNames]);

  return _properties;
}

