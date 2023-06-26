import React from "react";

const _staticStore = {};
export const useStaticStore = (id, initialVal = {}) => {
  if (!_staticStore.hasOwnProperty(id)) { _staticStore[id] = (initialVal === null) ? {} : (initialVal instanceof Object) ? initialVal : { value: initialVal }; }
  return [
    { ..._staticStore[id] },
    (updatedVal) => {
      if (updatedVal === null) { return; }
      if (updatedVal instanceof Object) { _staticStore[id] = { ..._staticStore[id], ...updatedVal }; return; }
      _staticStore[id].value = updatedVal;
      return;
    }
  ];
};

export const useLocalStorage = (key, initialVal = "") => {
  const [_val, _setVal] = React.useState(initialVal);
  const _classNameRef = React.useRef((initialVal === null) ? "null" : initialVal.constructor.name);
  React.useEffect(() => {
    if (window.localStorage) {
      if (!window.localStorage[key]) {
        if (initialVal !== null) {
          window.localStorage[key] = JSON.stringify({ t: initialVal.constructor.name, v: initialVal });
        }
      } else {
        if (initialVal === null) {
          window.localStorage.removeItem(key);
        } else {
          const _storedVal = JSON.parse(window.localStorage[key]);
          _setVal(() => {
            _classNameRef.current = _storedVal.t;
            return _storedVal.v;
          });
        }
      }
    }

    return () => true;
  }, [key, initialVal]);

  return [_val, (newVal) => {
    if (window.localStorage[key]) {
      if (newVal === null || newVal === undefined) {
        window.localStorage.removeItem(key);
        _classNameRef.current = "null";
      } else {
        const _className = newVal.constructor.name;
        _classNameRef.current = _className;
        window.localStorage[key] = JSON.stringify({ t: _className, v: newVal });
      }
    }
  
    return _setVal(newVal);
  }, _classNameRef];
};
