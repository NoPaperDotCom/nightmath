import React from "react";
import { PureComponent } from "./pure";
import { subscribe, dispatchEvent } from "./../utils";

// Overlay
export const Overlay = React.forwardRef(({
  onLoad=(display) => true,
  color=false, // C({ h, s, l, a }) or M([C, C, C, C, C]) based on media
  baseStyle={},
  children,
  ...props
}, ref) => {
  const _newRef = React.useRef();

  React.useEffect(() => {
    const _el = (ref) ? ref.current : _newRef.current;
    const _unsubscribe = subscribe(_el.id + "_display", ({ detail }) => {
      if (!detail.display && _el.unsubscribe) {
        _el.unsubscribe();
      }

      if (typeof onLoad === "function") { onLoad(detail.display); }
      _el.style.display = detail.display ? "flex" : "none";
      _el.unsubscribe = (detail.display) ? subscribe("contextmenu", (e) => e.preventDefault()) : false;
      window.document.body.style.overflow = detail.display ? "hidden" : "auto";
    });

    return () => {
      _unsubscribe();
      if (_el.unsubscribe) { _el.unsubscribe(); }
    };
  }, [ref, onLoad]);

  const _style = {
    display: "none",
    position: "fixed",
    fullscreen: 10,
    overflow: "hidden",
    itemPosition: "center",
    background: color,
    ...baseStyle
  };

  return (
    <PureComponent
      tagname="div"
      ref={(ref) ? ref : _newRef}
      baseStyle={_style}
      {...props}
    >
      {children}
    </PureComponent>
  );
});

export const setOverlayDisplay = (id, display = true) => dispatchEvent(id + "_display", { display });
