// the style tag ... 

export const GlobalStyle = ({ colorScheme = "normal" }) => (
  <style>
  {`
    *{box-sizing:border-box;color-scheme:${colorScheme}}
    html,body{margin:0;padding:0;}
    h1,p{margin:0 0 1em;}
    input,select,option,textarea,button {font-family: inherit;color: inherit;}
    input::placeholder{opacity:0.6;font-style:italic;}
    textarea::placeholder{opacity:0.6;font-style:italic;}
    [list]::-webkit-calendar-picker-indicator { display: none !important; }
  `}
  </style>
);

export const FontStyle = ({ fonts = "Roboto" }) => {
  let _family = [];
  if (Array.isArray(fonts)) {
    _family = fonts.map(f => `family=${f.replaceAll(" ", "+")}`);
    const _href = `https://fonts.googleapis.com/css2?${_family.join("&")}&display=swap`;
    return (<link href={_href} rel="stylesheet" />);
  }

  if (typeof fonts === 'object' && fonts !== null) {
    for (const [name, weight] of Object.entries(fonts)) {
      if (!weight) {
        _family.push(`family=${name.replaceAll(" ", "+")}`);
      } else {
        let _weight = (Array.isArray(weight)) ? weight : [weight.toString()];
        const _wght = _weight.join(";");
        _family.push(`family=${name.replaceAll(" ", "+")}:wght@${_wght}`);
      }
    }

    return (<link href={`https://fonts.googleapis.com/css2?${_family.join("&")}&display=swap`} rel="stylesheet" />);
  }

  return (<link href={`https://fonts.googleapis.com/css2?family=${fonts.toString().replaceAll(" ", "+")}&display=swap`} rel="stylesheet" />);
};

export const IconStyle = ({ type = "outlined" /* outlined, rounded, sharp */}) => {
  const _type = type.toLowerCase();
  const _sym = (_type === "outlined") ? "Outlined" : (_type === "sharp") ? "Sharp" : "Rounded";
  return (<link rel="stylesheet" href={`https://fonts.googleapis.com/css2?family=Material+Symbols+${_sym}:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200`} />)
}
