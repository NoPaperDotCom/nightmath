import React from "react";
import { PureComponent } from "./pure";

// Background
const _ColorBackground = React.forwardRef(({
  color=false, // C({ h, s, l, a }) or M() based on media
  fixed = false, // true, false or M() based on media
  baseStyle = {},
  ...props
}, ref) => {
  const _style = {
    fixed,
    fullscreen: -10,
    borderRadius: "inherit",
    background: (!color) ? "transparent" : color,
    ...baseStyle
  };
  
  return (
    <PureComponent
      tagname="div"
      ref={ref}
      baseStyle={_style}
      {...props}
    />
  );
});

_ColorBackground.displayName = "ColorBackground";
export const ColorBackground = _ColorBackground;

const _ImageBackground = React.forwardRef(({
  fixed = false, // true, false or M() based on media
  src="", // "" or M() based on media
  loc="center", // "" or [] or M() based on media
  size="contain", // "" or [] or M() based on media
  repeat=false, // false or "x", "y", "xy" or M() based on media
  baseStyle = {},
  ...props
}, ref) => {
  const _style = {
    fixed,
    fullscreen: -10,
    borderRadius: "inherit",
    backgroundImage: src,
    backgroundRepeat: repeat,
    backgroundSize: size,
    backgroundPosition: loc,
    backgroundFixed: fixed,
    ...baseStyle
  };
  
  return (
    <PureComponent
      tagname="div"
      ref={ref}
      baseStyle={_style}
      {...props}
    />
  );
});

_ImageBackground.displayName = "ImageBackground";
export const ImageBackground = _ImageBackground;

const _VideoBackground = React.forwardRef(({
  src="", // "" or M() based on media
  fixed = false, // true, false or M() based on media
  loop=true,
  baseStyle = {},
  ...props
}, ref) => {
  const _style = {
    fixed,
    fullscreen: -10,
    borderRadius: "inherit",
    ...baseStyle
  };
  
  return (
    <PureComponent
      ref={ref}
      tagname="video"
      autoplay
      muted
      loop={loop}
      baseStyle={_style}
      {...props}
    >
      <source src={src} type="video/mp4"></source>
    </PureComponent>
  );
});

_VideoBackground.displayName = "VideoBackground";
export const VideoBackground = _VideoBackground;
