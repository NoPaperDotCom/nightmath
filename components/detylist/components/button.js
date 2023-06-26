import React from "react";
import { PureComponent } from "./pure";
import { useEventListener } from "./../hooks";

const Base = React.forwardRef(({
  disabled = false,
  color = false, // C({ h, s, l, a }) or M() based on media
  hoverScaleEffect = false, // false or true (default 1.05) or number
  hoverLightEffect = false, // false or true (default color) or C()
  hoverColorEffect = false, // false or true (default 180) or number or C()
  hoverShadowEffect = false, // false or true or number
  hoverStyle = {}, 
  focusScaleEffect = false, // false or true (default 0.95) or number
  focusLightEffect = false, // false or true (default color) or C()
  focusColorEffect = false, // false or true (default 180) or number or C()
  focusShadowEffect = false, // false or true or number
  focusStyle = {},
  statusStyle = {},
  children,
  ...props
}, ref) => {
  const _newRef = React.useRef(null);
  const { eventName } = useEventListener((ref) ? ref : _newRef, "pointerenter,pointerleave,pointerdown,pointerup");
  const _hoverStyle = React.useMemo(() => {
    let _style = {};
    if (eventName === "pointerenter") {
      _style.cursor = "pointer";
      if (hoverScaleEffect) { _style.scale = (hoverScaleEffect === true) ? 1.05 : hoverScaleEffect; }
      if (hoverLightEffect) { _style.textShadow = (hoverLightEffect === true) ? color : hoverLightEffect; }
      if (hoverColorEffect === true) {_style.hueRotate = 180; }
      if (typeof hoverColorEffect === "number") {_style.hueRotate = hoverColorEffect; }
      if (hoverColorEffect instanceof Object && hoverColorEffect !== null) {_style.color = hoverColorEffect; }
      if (hoverShadowEffect) { _style.shadow = hoverShadowEffect; }
      _style = { ..._style, ...hoverStyle };
    }

    return _style;
  }, [eventName, color, hoverScaleEffect, hoverLightEffect, hoverColorEffect, hoverShadowEffect, hoverStyle]);

  const _focusStyle = React.useMemo(() => {
    let _style = {};
    if (eventName === "pointerdown") {
      _style.cursor = "pointer";
      if (focusScaleEffect) { _style.scale = (focusScaleEffect === true) ? 0.95 : focusScaleEffect; }
      if (focusLightEffect) { _style.textShadow = (focusLightEffect === true) ? color : focusLightEffect; }
      if (focusColorEffect === true) {_style.hueRotate = 180; }
      if (typeof focusColorEffect === "number") {_style.hueRotate = focusColorEffect; }
      if (focusColorEffect instanceof Object && focusColorEffect !== null) {_style.color = focusColorEffect; }
      if (focusShadowEffect) { _style.shadow = focusShadowEffect; }
      _style = { ..._style, ...focusStyle };
    }

    return _style;
  }, [eventName, color, focusScaleEffect, focusLightEffect, focusColorEffect, focusShadowEffect, focusStyle]);

  const _disabledStyle = (disabled) ? {
    cursor: "not-allowed",
    color: "disabled",
    grayScale: 1
  } : {};

  return (
    <PureComponent
      ref={(ref) ? ref : _newRef}
      statusStyle={{ ..._hoverStyle, ..._focusStyle, ..._disabledStyle, ...statusStyle }}
      transitions={{ transform: { duration: 0.2, timeFunction: "ease-in-out", delay: 0 } }}
      disabled={disabled}
      {...props}
    >
      {children}
    </PureComponent>
  );
});

Base.displayName = "Base";

const _Link = React.forwardRef(({
  underline = false, // false, "-","--", "=", ".", "(" or number or C() or {t,c,w} or M() based on media
  color = false, // C({ h, s, l, a }) or M() based on media
  size = 1, // rem or M() based on media
  baseStyle = {},
  children,
  ...props
}, ref) => (
  <Base
    ref={ref}
    tagname="a"
    color={color}
    baseStyle={{
      display: "inline-block",
      align: ["center", "center"],
      fontSize: size,
      color,
      underline,
      fontLine: (underline === true) ? "-" : underline,
      userSelect: false,
      ...baseStyle
    }}
    {...props}
  >
    {children}
  </Base>
));

_Link.displayName = "Link";
export const Link = _Link;

const _OutlineBtn = React.forwardRef(({
  color = false, // C({ h, s, l, a }) or M() based on media
  size = 1, // rem or M() based on media
  border = false, // false or true (default L({ t: '-', w: 0.2 })) or rem or C() or {t,c,w} or [x, y] or [t, r, b, l] or M() based on media
  rounded = false, // false or true (default '()' ) or "[","(","{" or rem or [tl,tr,br,bl] or M() based on media
  padding = 0.8, // number or [x,y] or [t,r,b,l] or M() based on media
  baseStyle = {},
  children,
  ...props
}, ref) => (
  <Base
    ref={ref}
    tagname="button"
    color={color}
    baseStyle={{
      display: "inline-flex",
      itemPosition: ["center", "center"],
      size,
      color,
      backgroundColor: "transparent",
      padding,
      border: (border === false) ? "" : (border === true) ? "-" : border,
      rounded: (rounded === false) ? "[]" : (rounded === true) ? "()" : rounded,
      ...baseStyle
    }}
    {...props}
  >
    {children}
  </Base>
));

_OutlineBtn.displayName = "OutlineBtn";
export const OutlineBtn = _OutlineBtn;

const _FillBtn = React.forwardRef(({
  color = false, // C({ h, s, l, a }) or M() based on media
  size = 1, // rem or M() based on media
  shadow = false, // true or number or M() based on media
  border = false, // false or true (default L({ t: '-', w: 0.2 })) or rem or C() or {t,c,w} or [x, y] or [t, r, b, l] or M() based on media
  rounded = false, // false or true (default '()' ) or "[","(","{" or rem or [tl,tr,br,bl] or M() based on media
  padding = 0.8, // rem or [x,y] or [t,r,b,l] or M() based on media
  baseStyle = {},
  children,
  ...props
}, ref) => (
  <Base
    ref={ref}
    tagname="button"
    color={color}
    baseStyle={{
      display: "inline-flex",
      itemPosition: ["center", "center"], 
      size,
      color: "white",
      background: color,
      shadow,
      padding,
      border: (border === false) ? "" : (border === true) ? "-" : border,
      rounded: (rounded === false) ? "[]" : (rounded === true) ? "()" : rounded,
      ...baseStyle
    }}
    {...props}
  >
    {children}
  </Base>
));

_FillBtn.displayName = "FillBtn";
export const FillBtn = _FillBtn;

const _ImageBtn = React.forwardRef(({
  src = "", // "" or M() based on media
  size = 1, // % or [x,y] or M() based on media
  shadow = false, // true or number or M() based on media
  border = false, // false or true (default L({ t: '-', w: 0.2 })) or rem or C() or {t,c,w} or [x, y] or [t, r, b, l] or M() based on media
  rounded = false, // false or true (default '()' ) or "[","(","{" or rem or [tl,tr,br,bl] or M() based on media
  baseStyle = {},
  ...props
}, ref) => (
  <Base
    ref={ref}
    tagname="button"
    color={{ s: 0, l: 0, a: 0.5 }}
    baseStyle={{
      size,
      shadow,
      backgroundImage: src,
      backgroundRepeat: false,
      backgroundSize: "contain",
      backgroundPosition: "center",
      backgroundFixed: false,
      border: (border === false) ? "" : (border === true) ? "-" : border,
      rounded: (rounded === false) ? "[]" : (rounded === true) ? "()" : rounded,
      ...baseStyle
    }}
    {...props}
  />
));

_ImageBtn.displayName = "ImageBtn";
export const ImageBtn = _ImageBtn;

