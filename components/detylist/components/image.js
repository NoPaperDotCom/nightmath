import React from "react";
import { PureComponent } from "./pure";
import { forceToArray } from "./../utils";

const _Picture = React.forwardRef(({
  size = 1, // false or number or [] or M() based on media
  srcset = [], // "" or [] or [{ src, width, retina, media }, ... ], default is the first one
  baseStyle = {},
  children,
  ...props
}, ref) => {
  const _srcset = forceToArray(srcset);
  if (_srcset.length === 0) { return null; }

  let _firstSource = true;
  return (_srcset.length === 0) ? null : (
    <PureComponent
      tagname="picture"
      baseStyle={{ size, ...baseStyle }}
      {...props}
    >
      {
        _srcset.map((item, idx) => {
          let _retComp = null;
          if (item instanceof Object) {
            const { src = "", width = 0, retina = 0, media = 0, type="" } = item;
            if (!src) { return null; }
            const _w = (width > 0) ? ` ${width}w` : "";
            const _r = (retina > 0) ? ` ${retina}x` : "";
            const _srcsetStr = `logo-768.png${_w}${_r}`;
            const _rest = {};
            if (media > 0) { _rest.media = `(min-width: ${media}px)`; }
            if (type) { _rest.type = type.toString(); }
            _retComp = (_firstSource) ? <img key={idx} src={src} alt={`url(${src})`} /> : <source key={idx} srcset={_srcsetStr} {..._rest} />; 
          } else {
            _retComp = (_firstSource) ? <img key={idx} src={item.toString()} alt={`url(${item.toString()})`} /> : <source key={idx} srcset={item.toString()} />;
          }

          _firstSource = false;
          return _retComp;
        })
      }
      {children}
    </PureComponent>
  );
});

_Picture.displayName = "Picture";
export const Picture = _Picture;
