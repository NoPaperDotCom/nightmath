import React from "react";
import { useMediaContext, useThemeContext, useStyle, useAnimation, useTransition } from "./../hooks";

// the base component for detylist
export const _PureComponent = React.forwardRef(({
  id=false,
  tagname="div",
  baseStyle={},
  statusStyle={},
  animations=[], /* [{ keyframes: [], duration = 2, delay = 1, timeFunction = "ease-in-out", fillMode = "both", count = "infinite", alternate = false }, ... ] */
  transitions={}, /* { [prop]: { duration, timeFunction, delay }, ... } */
  children,
  ...props
}, ref) => {
  const { mediaSize } = useMediaContext();
  const { baseTheme } = useThemeContext();
  const _baseStyle = useStyle(baseStyle, mediaSize, baseTheme); 
  const _statusStyle = useStyle(statusStyle, mediaSize, baseTheme);
  const _animationStyle = useAnimation(animations, mediaSize, baseTheme);
  const _transitionStyle = useTransition(transitions);

  const _newId = React.useId();
  const _id = (!id || id.length === 0) ? _newId : id;
  const Tag = tagname;

  if (process.env.NODE_ENV !== "production") {
    console.log('-----------------------');
    console.log(`Render ${tagname}#${_id}`);
    console.log("Base Style - ");
    console.log(_baseStyle);

    if (Object.keys(_statusStyle).length > 0) {
      console.log("Status Style - ");
      console.log(_statusStyle);
    }

    if (Object.keys(_animationStyle).length > 0) {
      console.log("Animation Style - ");
      console.log(_animationStyle);
    }

    if (Object.keys(_transitionStyle).length > 0) {
      console.log("Transition Style - ");
      console.log(_transitionStyle);
    }
    console.log('-----------------------');
  }

  return <Tag
    ref={ref}
    id={_id}
    style={{
      ..._baseStyle,
      ..._transitionStyle,
      ..._statusStyle,
      ..._animationStyle
    }}
    {...props}
  >
    {children}
  </Tag>
});

_PureComponent.displayName = "PureComponent";
export const PureComponent = _PureComponent;
