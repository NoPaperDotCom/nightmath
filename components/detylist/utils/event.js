export const dispatchEvent = (evtName, params = {}) =>
  window.dispatchEvent(new CustomEvent(evtName, { detail: params }));

export const subscribe = (evtName, handler, selector = window) => {
  selector.addEventListener(evtName, handler);
  return () => selector.removeEventListener(evtName, handler);
};
