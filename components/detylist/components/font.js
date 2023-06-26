import React from "react";
import { PureComponent } from "./pure";
import { useEventListener } from "./../hooks";

const _Text = React.forwardRef(({
  color = false, // false or C() or M() based on media
  background = false, // false or url or {} or C() or M() based on media
  size = 1,  // false or rem or M() based on media
  weight = false,  // false or rem or M() based on media
  italic = false, // false or M() based on media
  spacing = false,  // false or rem or M() based on media
  height = false, // false or rem or M() based on media
  family = false, // false or "" or M() based on media
  underline = false, // false or "" or M() based on media
  overline = false, // false or "" or M() based on media
  lineThrough = false, // false or "" or M() based on media
  lineStyle = false, // false or "-","--", "=", ".", "(" or rem or C() or {t,c,w} or M() based on media 
  baseStyle = {},
  children,
  ...props
}, ref) => {
  const _style = {
    fontColor: color,
    fontBackground: background,
    underline,
    overline,
    lineThrough,
    fontLine: lineStyle,
    fontSize: size,
    fontFamily: family,
    fontWeight: weight,
    letterSpacing: spacing,
    lineHeight: height,
    userSelect: false,
    italic,
    ...baseStyle
  };

  return (
    <PureComponent
      tagname="span"
      ref={ref}
      baseStyle={_style}
      {...props}
    >
      {children}
    </PureComponent>
  );
});

_Text.displayName = "Text";
export const Text = _Text;

const _TypingText = React.forwardRef(({
  content = "Text", // "" or []
  repeated = true, // true or false for repeat typing
  duration = 7, // number for duration ...
  blinking = true, // true or false for blink effect 
  steps = 40, // animation step ...
  color = false, // false or C() or M() based on media
  background = false, // false or url or {} or C() or M() based on media
  blinkingColor = false, // false or "" or C() or M() based on media
  size = 1,  // false or rem or M() based on media
  weight = false,  // false or rem or M() based on media
  italic = false, // false or M() based on media
  spacing = false,  // false or rem or M() based on media
  height = false, // false or rem or M() based on media
  family = false, // false or "" or M() based on media
  baseStyle = {},
  ...props
}, ref) => {
  const _newRef = React.useRef(null);
  const _initialAnimation = React.useRef(false);
  const { eventName } = useEventListener((ref) ? ref : _newRef, "inview");
  const [_animationSetting, _setAnimationSetting] = React.useState({ displayText: "", contentIndex: 0, animations: [] });
  
  React.useEffect(() => {
    let _timer = false;
    if (eventName === "inview" && !_initialAnimation.current) {
      _initialAnimation.current = true;
      const _content = (Array.isArray(content)) ? content : [content];
      const _typingAnimation = {
        keyframes: [{ width: 0 }, { width: 1 }, { width: 0 }],
        duration,
        delay: 0,
        timeFunction: `steps(${steps}, end)`,
        fillMode: "both",
        count: "infinite",
        alternate: false
      };

      const _animations = [_typingAnimation];

      if (blinking) {
        const _blinkAnimation = {
          keyframes: [{ borderRightColor: "transparent" }, { borderRightColor: (!color) ? "black" : blinkingColor }, { borderRightColor: "transparent" }],
          duration: 0.8,
          delay: 0,
          timeFunction: "step-end",
          fillMode: "both",
          count: "infinite",
          alternate: false
        };

        _animations.push(_blinkAnimation);
      }

      _setAnimationSetting(prevSetting => ({ ...prevSetting, animations: _animations, displayText: _content[0] }));
      _timer = window.setInterval(() => _setAnimationSetting(prevSetting => {
        if (!repeated && prevSetting.contentIndex === _content.length - 1) {
          window.clearInterval(_timer);
          _timer = false;
          return { ...prevSetting, animations: [] };
        }

        const _nextContentIndex = (prevSetting.contentIndex === _content.length - 1) ? 0 : prevSetting.contentIndex + 1;
        return { ...prevSetting, contentIndex: _nextContentIndex, displayText: _content[_nextContentIndex] };
      }), duration * 1000);
    }

    return () => (_timer) ? true : window.clearInterval(_timer);
  }, [eventName, duration, steps, blinking, blinkingColor, color, repeated, content]);

  const _style = {
    display: "inline-block",
    fontColor: color,
    fontBackground: background,
    fontSize: size,
    fontFamily: family,
    fontWeight: weight,
    letterSpacing: spacing,
    lineHeight: height,
    userSelect: false,
    italic,
    overflow: "hidden",
    whiteSpace: "nowrap",
    maxWidth: "max-content",
    borderRightStyle: (blinking) ? "-" : "",
    borderRightWidth: (blinking) ? 10 : 0,
    ...baseStyle
  };

  return (
    <PureComponent
      tagname="div"
      ref={(ref) ? ref : _newRef}
      baseStyle={_style}
      animations={_animationSetting.animations}
      {...props}
    >
      {`${_animationSetting.displayText}`}
    </PureComponent>
  );
});

_TypingText.displayName = "TypingText";
export const TypingText = _TypingText;

const _Icon = React.forwardRef(({
  name="done", // the name of icon refer to google material icon
  type="rounded", // 'rounded','sharp','outlined'
  color = false, // false, C() or M() based on media
  size = 1,  // rem or M() based on media
  weight = false,  // rem or M() based on media
  fill=false, // true,false or M() based on media
  baseStyle={},
  ...props
}, ref) => {
  const _style = {
    color,
    fontSize: size,
    fontWeight: weight,
    fontFill: fill,
    userSelect: false,
    ...baseStyle
  };

  const _type = type.toLowerCase();
  return (
    <PureComponent
      tagname="span"
      className={`material-symbols-${(["rounded", "outlined", "sharp"].indexOf(_type) !== -1) ? _type : "rounded"}`}
      ref={ref}
      baseStyle={_style}
      {...props}
    >
      {name}
    </PureComponent>
  );
});

_Icon.displayName = "Icon";
export const Icon = _Icon;

const _Logo = React.forwardRef(({
  name="whatsapp", // name of the company
  color = "currentcolor", // false, C() or M() based on media
  size = 1,  // rem or M() based on media
  weight = false,  // rem or M() based on media
  baseStyle={},
  ...props
}, ref) => {
  const _style = {
    strokeLinecap: "round",
    strokeWidth: weight,
    stroke: color,
    fill: color
  };

  if (name === "whatsapp") {
    return (
      <PureComponent
        tagname="svg"
        baseStyle={{ svgSize: size, ...baseStyle }}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
        {...props}
      >
        <PureComponent
          tagname="path"
          d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"
          baseStyle={_style}
        />
      </PureComponent>
    );
  }

  if (name === "facebook") {
    return (
      <PureComponent
        tagname="svg"
        baseStyle={{ svgSize: size, ...baseStyle }}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        {...props}
      >
        <PureComponent
          tagname="path"
          d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z"
          baseStyle={_style}
        />
      </PureComponent>
    );
  }

  if (name === "twitter") {
    return (
      <PureComponent
        tagname="svg"
        baseStyle={{ svgSize: size, ...baseStyle }}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        {...props}
      >
        <PureComponent
          tagname="path"
          d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"
          baseStyle={_style}
        />
      </PureComponent>
    );
  }

  if (name === "youtube") {
    return (
      <PureComponent
        tagname="svg"
        baseStyle={{ svgSize: size, ...baseStyle }}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 576 512"
        {...props}
      >
        <PureComponent
          tagname="path"
          d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"
          baseStyle={_style}
        />
      </PureComponent>
    );
  }

  if (name === "google") {
    return (
      <PureComponent
        tagname="svg"
        baseStyle={{ svgSize: size, ...baseStyle }}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 488 512"
        {...props}
      >
        <PureComponent
          tagname="path"
          d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
          baseStyle={_style}
        />
      </PureComponent>
    );
  }

  if (name === "stripe") {
    return (
      <PureComponent
        tagname="svg"
        baseStyle={{ svgSize: size, ...baseStyle }}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 512"
        {...props}
      >
        <PureComponent
          tagname="path"
          d="M165 144.7l-43.3 9.2-.2 142.4c0 26.3 19.8 43.3 46.1 43.3 14.6 0 25.3-2.7 31.2-5.9v-33.8c-5.7 2.3-33.7 10.5-33.7-15.7V221h33.7v-37.8h-33.7zm89.1 51.6l-2.7-13.1H213v153.2h44.3V233.3c10.5-13.8 28.2-11.1 33.9-9.3v-40.8c-6-2.1-26.7-6-37.1 13.1zm92.3-72.3l-44.6 9.5v36.2l44.6-9.5zM44.9 228.3c0-6.9 5.8-9.6 15.1-9.7 13.5 0 30.7 4.1 44.2 11.4v-41.8c-14.7-5.8-29.4-8.1-44.1-8.1-36 0-60 18.8-60 50.2 0 49.2 67.5 41.2 67.5 62.4 0 8.2-7.1 10.9-17 10.9-14.7 0-33.7-6.1-48.6-14.2v40c16.5 7.1 33.2 10.1 48.5 10.1 36.9 0 62.3-15.8 62.3-47.8 0-52.9-67.9-43.4-67.9-63.4zM640 261.6c0-45.5-22-81.4-64.2-81.4s-67.9 35.9-67.9 81.1c0 53.5 30.3 78.2 73.5 78.2 21.2 0 37.1-4.8 49.2-11.5v-33.4c-12.1 6.1-26 9.8-43.6 9.8-17.3 0-32.5-6.1-34.5-26.9h86.9c.2-2.3.6-11.6.6-15.9zm-87.9-16.8c0-20 12.3-28.4 23.4-28.4 10.9 0 22.5 8.4 22.5 28.4zm-112.9-64.6c-17.4 0-28.6 8.2-34.8 13.9l-2.3-11H363v204.8l44.4-9.4.1-50.2c6.4 4.7 15.9 11.2 31.4 11.2 31.8 0 60.8-23.2 60.8-79.6.1-51.6-29.3-79.7-60.5-79.7zm-10.6 122.5c-10.4 0-16.6-3.8-20.9-8.4l-.3-66c4.6-5.1 11-8.8 21.2-8.8 16.2 0 27.4 18.2 27.4 41.4.1 23.9-10.9 41.8-27.4 41.8zm-126.7 33.7h44.6V183.2h-44.6z"
          baseStyle={_style}
        />
      </PureComponent>
    );
  }

  return <Text color={color} size={size} weight={weight} baseStyle={baseStyle} {...props}>{name}</Text>;
});

_Logo.displayName = "Logo";
export const Logo = _Logo;


/*
const _FontBlock = React.forwardRef(({
  inline = true, // true or false
  color = false, // false or C() or M() based on media
  shadow = false, // false or C() or M() based on media
  height = false,  // false or rem or M() based on media
  truncate = false, // false or M() based on media
  baseStyle = {},
  children,
  ...props
}, ref) => {
  const _style = {
    position: "relative",
    display: (inline) ? "inline-flex" : "block",
    width: (inline) ? "auto" : "100%",
    overflowWrap: "break-word",
    wordBreak: "break-all",
    justifyContent: "center",
    alignItems: "center", 
    lineHeight: height,
    textShadow: shadow,
    color,
    truncate,
    ...baseStyle
  };

  return (
    <PureComponent
      tagname={(inline) ? "span" : "div"}
      ref={ref}
      baseStyle={_style}
      {...props}
    >
      {children}
    </PureComponent>
  );
}); 

_FontBlock.displayName = "FontBlock";
export const FontBlock = _FontBlock;

const _FontBox = React.forwardRef(({
  highlight = false, // false or C() or M() based on media
  underline = false, // false or "" or C() or {t,c,w} or M() based on media
  overline = false, // false or "" or C() or {t,c,w} or M() based on media
  lineThrough = false, // false or "" or C() or {t,c,w} or M() based on media
  baseStyle = {},
  ...props
}, ref) => {
  const _ref = React.useRef(null);
  const [_box, _setBox] = React.useState({ height: 0, count: 0 });
  React.useEffect(() => {
    const _el = (ref) ? ref.current : _ref.current;
    let _observer = null;
    let _parentElement = null;
    if (_el) {
      _parentElement = _el.parentNode;
      _observer = new ResizeObserver((entries) => {
        if (entries[0].contentBoxSize) {
          const _boxHeight = entries[0].contentRect.height;
          const _fontSize = document.defaultView.getComputedStyle(_parentElement, null).getPropertyValue("line-height");
          const _fontSizeNumber = parseFloat(_fontSize.replace("px", ""), 10);
          _setBox({ height: _fontSizeNumber / 2, count: 2 * (parseInt(_boxHeight / _fontSizeNumber, 10)) });
        }
      });

      _observer.observe(_parentElement);
    }

    return () => { if (_observer) { _observer.unobserve(_parentElement); _observer.disconnect(); } return true; }; 
  }, [ref]);

  const _style = (idx) => ({
    width: "100%",
    height: `${_box.height}px`,
    top: `${idx * _box.height}px`,
    background: highlight,
    borderTop: (idx % 2 === 1 && overline) ? overline : (idx % 2 === 0 && lineThrough) ? lineThrough : false,
    borderBottom: (idx % 2 === 1 && underline) ? underline : false,
    ...baseStyle
  });

  return (
    <div ref={(ref) ? ref : _ref} style={{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0, padding: 0 }}>
      {[...Array(_box.count).keys()].map(i => (
        <PureComponent
          key={i}
          tagname="div"
          baseStyle={_style(i)}
          {...props}
        />
      ))}
    </div>
  );
});

_FontBox.displayName = "FontBox";
export const FontBox = _FontBox;
*/
