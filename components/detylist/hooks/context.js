import React from "react";
import { subscribe } from "./../utils";

let _MediaContext = null;
export const useMediaContext = () => {
  if (!_MediaContext) { throw ReferenceError("MediaProvider shall be provided for the use of MediaContext", "detylist/hooks/context.js", 6); } 
  const { mediaSizeList } = React.useContext(_MediaContext);
  const [_mediaSize, _setMediaSize] = React.useState(2); // mediaSizeIndex
  React.useEffect(() => {
    const _unsubscribe = mediaSizeList.map((mediaSize, idx) => {
      const _watcher = window.matchMedia((idx === mediaSizeList.length - 1) ? `(min-width: ${mediaSize}px)` : `(min-width: ${mediaSize}px) and (max-width: ${mediaSizeList[idx + 1] - 0.2}px)`);
      if (_watcher.matches) { _setMediaSize(idx); }
      return subscribe('change', (e) => (e.matches) ? _setMediaSize(idx) : false, _watcher);
    });

    return () => _unsubscribe.forEach(unsub => unsub());
  }, [mediaSizeList]);

  return { mediaSize: _mediaSize, mediaWidth: mediaSizeList[_mediaSize] };
};

export const MediaProvider = ({ mediaSizeList, children }) => {
  const Context = React.createContext();
  _MediaContext = Context;

  return (
    <Context.Provider value={{ mediaSizeList }}>
      {children}
    </Context.Provider>
  );
};

let _ThemeContext = null;
export const useThemeContext = () => {
  if (!_ThemeContext) { throw ReferenceError("ThemeProvider shall be provided for the use of ThemeContext", "detylist/hooks/context.js", 33); }
  return React.useContext(_ThemeContext);
};

export const ThemeProvider = ({ theme = {/* Please refer to default theme */}, children }) => {
  const _defaultTheme = {
    color: { h: 0, s: 0, l: 0, a: 1 },
    fontSize: 16,   // px
    fontWeight: 400, // unitless
    thickness: 16, // px
    radius: 16, // px
    spacing: 16 // px
  };

  const [_baseTheme, _setBaseTheme] = React.useState({ ..._defaultTheme, ...theme });
  const Context = React.createContext();
  _ThemeContext = Context;
  return <Context.Provider
      value={{
        baseTheme: _baseTheme,
        setBaseTheme: (style) => _setBaseTheme(o => ({ ...o, ...style }))
      }}
    >
      {children}
    </Context.Provider>;
};
