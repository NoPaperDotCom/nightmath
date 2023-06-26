import React from "react";
import { PureComponent } from "./pure";
import { 
  MediaProvider,
  ThemeProvider
} from "./../hooks";

// base container 
export const Container = ({
  size = [1, 1],  // x100% default 100vw, 100vh
  mediaSizeList = [0, 576, 768, 992, 1200],
  theme = {},
  colorPalette = {},
  children
}) => {
  const _size = (Array.isArray(size)) ? (size.length >= 2) ? size : (size.length === 1) ? [size[0],size[0]] : [1,1] : [size,size];
  const _theme = {
    color: { h: 0, s: 0, l: 0 },
    fontColor: "#000000",
    fontFamily: "",
    fontSize: 16,   // px
    fontWeight: 400, // unitless
    size: [16, 16], // px
    thickness: 16, // px
    radius: 16, // px
    spacing: 16, // px
    ...theme
  };

  const _defaultColor = {
    error: "#AA0000",
    focus: "#00008B",
    disabled: "#d3d3d3"
  };

  _theme.fontFamily = (Array.isArray(_theme.fontFamily)) ? _theme.fontFamily : (!_theme.fontFamily) ? [] : [_theme.fontFamily.toString()];
  _theme.colorPalette = { ..._defaultColor, ...colorPalette };
  _theme.size = (Array.isArray(_theme.size)) ? _theme.size.map(s => parseFloat(s)) : [parseFloat(_theme.size), parseFloat(_theme.size)];

  if (process.env.NODE_ENV !== "production") {
    console.log("Render Detylist Container ... ");
  }

  return (
    <div
      style={{
        minWidth: `${_size[0] * 100}vw}`,
        minHeight: `${_size[1] * 100}vh`,
        width: `${_size[0] * 100}vw}`,
        height: `${_size[1] * 100}vh`,
        fontSize: `${_theme.fontSize}px`,
        fontWeight: _theme.fontWeight,
        fontFamily: `${_theme.fontFamily.join(",")}${(_theme.fontFamily.length === 0) ? "" : ","}Arial,Helvetica,cursive,sans-serif`,
        color: _theme.fontColor,
        borderWidth: `${_theme.thickness}px`,
        outlineWidth: `${_theme.thickness}px`,
        zIndex: 0,
        position: "relative"
      }}
    >
      <MediaProvider mediaSizeList={mediaSizeList}>
        <ThemeProvider theme={_theme}>
          {children}
        </ThemeProvider>
      </MediaProvider>
    </div>
  );
};

// To locate the element
const _Locator = React.forwardRef(({
  loc = [0, 0], // x100% or [x,y,z] or M() based on media
  size = [1, 1], // x100% or [x,y] or M() based on media
  fixed = false, // true or false (use if fixed to the viewport)
  reverse = false, // top left or bottom right
  baseStyle = {},
  children,
  ...props
}, ref) => {
  const _loc = (reverse) ? { "-location": loc, size } : { location: loc, size };
  const _fixed = { fixed };
  const _style = {
    ..._loc,
    ..._fixed,
    ...baseStyle
  };

  return (
    <PureComponent
      tagname="div"
      baseStyle={_style}
      {...props}
    >
      {children}
    </PureComponent>
  );
});

_Locator.displayName = "Locator";
export const Locator = _Locator;

// the block
const _Block = React.forwardRef(({
  inline = false, // true or false
  size = false, // ratio or [w,h] or M() based on media
  padding = 0, // rem or [x,y], [l,r,t,b], M() based on media
  align = "center", // "center" or { x, y } or M() based on media
  border = false, // false or C() or {t,c,w} or 1 or [x, y] or [t, r, b, l] or M() based on media
  rounded = false, // false or "[","(",","{" or 1 or [tl,tr,br,bl] or M() based on media
  shadow = false, // false,true or em or M() based on media
  baseStyle = {},
  children,
  ...props
}, ref) => {
  const _style = {
    display: "inline-block",
    size,
    position: "relative",
    align,
    padding,
    border: (border === false) ? "" : (border === true) ? "-" : border,
    rounded: (rounded === false) ? "[]" : (rounded === true) ? "()" : rounded,
    shadow,
    ...baseStyle
  };

  return (
    <PureComponent
      tagname="div"
      ref={ref}
      baseStyle={_style}
      {...props}
    >
      {children}
    </PureComponent>
  );
});

_Block.displayName = "Block";
export const Block = _Block;

// the Flex
const _Flex = React.forwardRef(({
  inline = false, // true or false
  size = false, // ratio or [w,h] or M() based on media
  padding = 0, // rem or [x,y], [l,r,t,b], M() based on media
  gap = 0, // rem or M() based on media
  itemPosition = "center", // "center" or { x, y } or M() based on media
  border = false, // false or C() or {t,c,w} or 1 or [x, y] or [t, r, b, l] or M() based on media
  rounded = false, // false or "[","(",","{" or 1 or [tl,tr,br,bl] or M() based on media
  shadow = false, // false,true or em or M() based on media
  baseStyle = {},
  children,
  ...props
}, ref) => {
  const _style = {
    display: (inline) ? "inline-flex" : "flex",
    flexWrap: "wrap",
    position: "relative",
    gap,
    itemPosition,
    padding,
    border: (border === false) ? "" : (border === true) ? "-" : border,
    rounded: (rounded === false) ? "[]" : (rounded === true) ? "()" : rounded,
    shadow,
    ...((!size) ? { flex: 1, height: 1 } : { size }),
    ...baseStyle
  };

  return (
    <PureComponent
      tagname="div"
      ref={ref}
      baseStyle={_style}
      {...props}
    >
      {children}
    </PureComponent>
  );
});

_Flex.displayName = "Flex";
export const Flex = _Flex;

const _Canvas = React.forwardRef(({
  size=1, // number or [] or M() based on media
  border=false, // true or false or number or "-" or C() or {} or [] or M() based on media
  rounded=false, // true or false or "()" or [] or M() based on media
  baseStyle = {},
  draw = (ctx, time) => true,
  ...props
}, ref) => {
  const _newRef = React.useRef();
  React.useEffect(() => {
    let _requestId = false;
    const _canvas = (ref) ? ref.current : _newRef.current;
    if (_canvas.getContext) {
      const _ctx = _canvas.getContext("2d");
      let _prevTimestamp = false;
      const _render = () => {
        const _timestamp = new Date();
        const _redraw = (typeof draw === "function") ? draw(_ctx, (!_prevTimestamp) ? 0 : _timestamp - _prevTimestamp) : false;
        _prevTimestamp = _timestamp;
        if (_redraw) {
          _requestId = window.requestAnimationFrame(_render);
        }
      };

      _render();
    }

    return () => (_requestId) ? window.cancelAnimationFrame(_requestId) : true;
  }, [ref, draw]);

  return (
    <PureComponent
      tagname="canvas"
      ref={(ref) ? ref : _newRef}
      baseStyle={{
        size,
        border: (border === false) ? "" : (border === true) ? "-" : border,
        rounded: (rounded === false) ? "[]" : (rounded === true) ? "()" : rounded,
        ...baseStyle
      }}
      {...props}
    />
  );
});

_Canvas.displayName = "Canvas";
export const Canvas = _Canvas;



/*
// Grid 
const _Grid = React.forwardRef(({
  inline = false, // true or false
  size = 1, // ratio or [w,h] or M() based on media
  grid = [2,2], // number or [w,h] or M() based on media
  gap = 0, // rem or [x,y] or M() based on media
  baseStyle = {},
  children,
  ...props
}, ref) => (
  <PureComponent
    tagname="div"
    baseStyle={{
      display: (inline) ? "inline-grid" : "grid",
      size,
      grid,
      gap,
      ...baseStyle
    }}
    {...props}
  >
    {children}
  </PureComponent>
));

_Grid.displayName = "Grid";
export const Grid = _Grid;
*/