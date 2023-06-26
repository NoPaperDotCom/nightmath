import React from "react";

export const useInterval = (callback /* (prevState) => {} */, interval /* interval to execution */, initialState = false) => {
  const _timerRef = React.useRef(false);
  const _intervalRef = React.useRef(interval);
  const [_state, _setState] = React.useState(initialState);

  React.useEffect(() => {
    _timerRef.current = window.setInterval(() => _setState(callback), _intervalRef.current);
    return () => (_timerRef.current) ? window.clearInterval(_timerRef.current) : true;
  }, [callback]);
  
  return [_state, () => (_timerRef.current) ? window.clearInterval(_timerRef.current) : true];
};

export const useTimeout = (callback /* (prevState) => {} */, interval /* interval to execution */, initialState = false) => {
  const _timerRef = React.useRef(false); 
  const _intervalRef = React.useRef(interval);
  const [_state, _setState] = React.useState(initialState);

  React.useEffect(() => {
    _timerRef.current = window.setTimeout(() => { 
      _setState(callback);
      return window.clearTimeout(_timerRef.current);
    }, _intervalRef.current);

    return () => (_timerRef.current) ? window.clearTimeout(_timerRef.current) : true;
  }, [callback]);
  
  return [_state, () => (_timerRef.current) ? window.clearTimeout(_timerRef.current) : true];
};
