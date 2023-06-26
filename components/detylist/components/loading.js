import React from "react";
import { PureComponent } from "./pure";

const _Spread = React.forwardRef(({
  size = 1,
  spinningSpeed = 1,
  color = false, // true or false or "" or {} or C() or M() based on media
  baseStyle = {},
  ...props
}, ref) => {
  const _animation = {
    keyframes: [{ rotate: 0 }, { rotate: 360 }],
    duration: spinningSpeed,
    delay: 0,
    timeFunction: "linear",
    fillMode: "both",
    count: "infinite",
    alternate: false
  };

  return (
    <PureComponent
      ref={ref}
      tagname="svg"
      baseStyle={{ size, stroke: color, ...baseStyle }}
      animations={[_animation]}
      viewBox="0 0 256 256"
      {...props}
    >
      <line x1="128" y1="32" x2="128" y2="64" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line>
      <line
        x1="195.9"
        y1="60.1"
        x2="173.3"
        y2="82.7"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="24"
      ></line>
      <line x1="224" y1="128" x2="192" y2="128" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line>
      <line
        x1="195.9"
        y1="195.9"
        x2="173.3"
        y2="173.3"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="24"
      ></line>
      <line x1="128" y1="224" x2="128" y2="192" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line>
      <line
        x1="60.1"
        y1="195.9"
        x2="82.7"
        y2="173.3"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="24"
      ></line>
      <line x1="32" y1="128" x2="64" y2="128" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line>
      <line
        x1="60.1"
        y1="60.1"
        x2="82.7"
        y2="82.7"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="24"
      ></line>
    </PureComponent>
  );
});

_Spread.displayName = "Spread";
export const Spread = _Spread;

const _Spin = React.forwardRef(({
  size = 1,
  spinningSpeed = 1,
  color = false, // true or false or "" or {} or C() or M() based on media
  baseStyle = {},
  ...props
}, ref) => {
  const _animation = {
    keyframes: [{ rotate: 0 }, { rotate: 360 }],
    duration: spinningSpeed,
    delay: 0,
    timeFunction: "linear",
    fillMode: "both",
    count: "infinite",
    alternate: false
  };

  return (
    <PureComponent
      ref={ref}
      tagname="svg"
      baseStyle={{ size, ...baseStyle }}
      animations={[_animation]}
      viewBox="3 3 18 18"
      {...props}
    >
      <PureComponent
        tagname="path"
        baseStyle={{ fill: "#e5e7eb" }}
        d="M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5ZM3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z"
      ></PureComponent>
      <PureComponent
        tagname="path"
        baseStyle={{ fill: color }}
        d="M16.9497 7.05015C14.2161 4.31648 9.78392 4.31648 7.05025 7.05015C6.65973 7.44067 6.02656 7.44067 5.63604 7.05015C5.24551 6.65962 5.24551 6.02646 5.63604 5.63593C9.15076 2.12121 14.8492 2.12121 18.364 5.63593C18.7545 6.02646 18.7545 6.65962 18.364 7.05015C17.9734 7.44067 17.3403 7.44067 16.9497 7.05015Z"
      ></PureComponent>
    </PureComponent>
  );
});

_Spin.displayName = "Spin";
export const Spin = _Spin;

const _Progress = React.forwardRef(({
  size = 1, // false or number or [] or M() based on media
  color = false, // true or false or "" or {} or C() or M() based on media
  value = "infinity", // number [0 ~ 1] or "infinity"
  rounded = true, // false or true or "" or [] or M() based on media
  baseStyle = {},
  children,
  ...props
}, ref) => {
  const [_value, _setValue] = React.setState(0);
  const _baseStyle = {
    size,
    backgroundColor: color,
    rounded: (rounded === false) ? "[]" : (rounded === true) ? "()" : rounded,
    ...baseStyle
  };

  React.useEffect(() => {
    let _timer = false;
    if (value === "infinity") {
      _timer = window.setInterval(() => _setValue(prevVal => (prevVal === 100) ? 0 : prevVal + 1), 1000)
    }
  
    return () => (_timer) ? window.clearInterval(_timer) : true;
  }, [value]);

  return (
    <PureComponent
      ref={ref}
      tagname="progress"
      baseStyle={_baseStyle}
      min={0}
      max={100}
      value={(value === "infinity") ? _value : value}
      {...props}
    >
      {children}
    </PureComponent>
  );
});

_Progress.displayName = "Progress";
export const Progress = _Progress;
