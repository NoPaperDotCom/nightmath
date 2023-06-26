import React from "react";
import { subscribe, dispatchEvent } from "./../utils";

const _getElement = (ref /* ref or element or id */) => {
  let _el = window;
  if (ref instanceof Element) { _el = ref; }
  else if (ref instanceof Object && ref !== null && ref.hasOwnProperty("current")) {
    if (ref.current instanceof Element) { _el = ref.current; }
  } else if (typeof ref === "string" && ref.length > 0) {
    const _elById = document.getElementById(ref);
    if (_elById instanceof Element) { _el = _elById; }
  }

  return _el;
};

const _getElementId = (ref /* ref or element or id */) => {
  if (ref instanceof Element) { return ref.id; }
  if (ref instanceof Object && ref !== null && ref.hasOwnProperty("current")) {
    if (ref.current instanceof Element) { return ref.current.id; }
  }

  return ref.toString();
};

export const useEventListener = (ref /* ref or element or id or [] */, eventListenerList = false, preventDefault = false, requireDetail = false) => {
  const [_eventStatus, _setEventStatus] = React.useState({ element: false, eventName: "", event: false });
  React.useEffect(() => {
    const _unsubscribes = [];

    let _eventListenerList = (!eventListenerList) ? [] : (Array.isArray(eventListenerList)) ? eventListenerList : eventListenerList.toString().split(",");
    const _set = new Set(_eventListenerList);
    _eventListenerList = Array.from(_set);
    if (_eventListenerList.length > 0) {
      const _ref = (ref === false || ref === null) ? [window] : (Array.isArray(ref)) ? ref : [ref];
      const _elements = _ref.map(_getElement);
      const _setEvent = ({ element, event, eventName}) => _setEventStatus(old => {
        if (old.element === element && old.eventName === eventName && !requireDetail) { return old; }

        if (process.env.NODE_ENV !== "production") {
          console.log(`${(element === window) ? "window" : (element === document) ? "document" : element.id} trigger event ${eventName} ...`);
        }

        return { element, event, eventName };
      });

      _elements.forEach(el => {
        if (el) {
          _eventListenerList.forEach(eventName => {
            if (eventName === "inview" && el instanceof Element) {
              const _observer = new IntersectionObserver((entries) => _setEvent({ element: entries[0].target, event: entries[0], eventName }), { root: null, rootMargin: "0px", threshold: 1.0 });
              _observer.observe(el);
              _unsubscribes.push(() => { _observer.unobserve(el); _observer.disconnect(); });
            } else if (eventName === "resize" && el instanceof Element) {
              const _observer = new ResizeObserver((entries) => _setEvent({ element: entries[0].target, event: entries[0], eventName }));
              _observer.observe(el);
              _unsubscribes.push(() => { _observer.unobserve(el); _observer.disconnect(); });
            } else {
              _unsubscribes.push(subscribe(eventName, (e) => {
                e.stopPropagation();
                if (preventDefault) { e.preventDefault(); }
                return _setEvent({ element: e.target, event: e, eventName });
              }, el));
            }

            if (process.env.NODE_ENV !== "production") {
              console.log(`${el.id} listen event ${eventName} (requireDetail = ${requireDetail}, preventDefault = ${preventDefault}) ...`);
            } 
          });
        }

        return;
      });
    }

    return () => _unsubscribes.map(unsub => unsub());
  }, [ref, eventListenerList, requireDetail, preventDefault]);
  
  return _eventStatus;
};

export const useHoverEffect = (ref /* ref or element or id or [] */, styleToApply = {}) => {
  const { eventName } = useEventListener(ref, "pointerenter,pointerleave", true);
  const _json = JSON.stringify(styleToApply);
  return React.useMemo(() => {
    if (eventName === "pointerenter") {
      return JSON.parse(_json);
    }

    return {};
  }, [eventName, _json]);
};

export const usePressEffect = (ref /* ref or element or id or [] */, styleToApply = {}) => {
  const { eventName } = useEventListener(ref, "pointerdown,pointerup", true);
  const _json = JSON.stringify(styleToApply);
  return React.useMemo(() => {
    if (eventName === "pointerdown") {
      return JSON.parse(_json);
    }

    return {};
  }, [eventName, _json]);
};

export const useFocusEffect = (ref /* ref or element or id or [] */, styleToApply = {}) => {
  const { eventName } = useEventListener(ref, "focus,blur", true);
  const _json = JSON.stringify(styleToApply);
  return React.useMemo(() => {
    if (eventName === "focus") {
      return JSON.parse(_json);
    }

    return {};
  }, [eventName, _json]);
};

export const useMethod = (ref /* ref or element or id */, name = "method", method = (args) => true) => {
  React.useEffect(() => {
    const _el = _getElement(ref);
    const _name = (_el === window) ? name : `${_el.id}_${name}`;
    const _unsubscribe = subscribe(_name, ({ detail }) => (typeof method === "function") ? method(...detail.params) : true);
    return () => _unsubscribe();
  }, [ref, name, method]);

  return;
};

export const callMethod = (ref, name, ...params) => {
  const _id = _getElementId(ref);
  return dispatchEvent((!_id) ? name : `${_id}_${name}`, { params });
}
