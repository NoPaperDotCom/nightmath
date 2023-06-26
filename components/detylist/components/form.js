import React from "react";
import { PureComponent } from "./pure";
import { useThemeContext, useEventListener, useMethod } from "./../hooks";
import { forceToArray } from "./../utils";

const InputBorder = ({
  color = false, // false or C() or M() based on media
  size = 1, // number or M() based on media 
  label = false, // false or str
  width = 1, // number or M() based on media
  border = false, // false or true (default "-") or 1 or { t: "-", w: 2 } or [] or M() based on media
  rounded = false, // false or true (default '[' ) or "[","(","{" or 1 or [tl,tr,br,bl] or M() based on media
  status = "normal", // "normal" or "error" or "focus" or "disabled" ...
  floatLabel=false,
  children
}) => {
  const _color = (status === "normal") ? color : status;
  const _baseBorderStyle = { position: "relative", outline: "", width, rounded: (rounded === true) ? "{}" : rounded, border: (border === false) ? "" : border };
  const _statusBorderStyle = { borderColor: _color };
  const _baseLabelStyle = { align: "start", userSelect: false, fontSize: size, opacity: 0, scale: 1, translate:[0, "16px"] };
  const _statusLabelStyle = { translate: [0, 0], opacity: 1, scale: 0.8, color: _color };
    
  return (
    <PureComponent
      tagname="fieldset"
      baseStyle={_baseBorderStyle}
      statusStyle={_statusBorderStyle}
    >
      {
        (!label) ? null :
        <PureComponent
          tagname="legend"
          baseStyle={_baseLabelStyle}
          statusStyle={(!floatLabel) ? {} : _statusLabelStyle}
          transitions={{ transform: { duration: 0.2, timeFunction: "ease-in-out", delay: 0 }, opacity: { duration: 0.2, timeFunction: "ease-in-out", delay: 0 } }}
        >
          {(!floatLabel) ? null : label}
        </PureComponent>
      }
      {children}
    </PureComponent>
  );
};

const BaseInput = React.forwardRef(({
  tagname = "input",
  label = true, // true or false
  floatLabel = false, // true or false
  placeholder = "", // ""
  validation = true, // true or (val) => return true / "error" / new Error
  color = false, // false or "" or C() or M() based on media
  size = 1, // number or M() based on media
  width = 1, // number or M() based on media
  underline = false, // false or true (default { t: '-', w: 0.2 }) or 1 or {} or M() based on media
  border = false, // false or true (default { t: '-', w: 0.2 }) or 1 or {} or M() based on media
  rounded = false, // false or true (default '[' ) or "[","(","{" or 1 or [tl,tr,br,bl] or M() based on media
  disabled = false,
  baseStyle = {},
  statusStyle = {},
  onBlur = false,
  children,
  ...props
}, ref) => {
  const _newRef = React.useRef(null);
  const { eventName } = useEventListener((ref) ? ref : _newRef, "focus,blur");
  const [_isValid, _setIsValid] = React.useState(true);
  useMethod((ref) ? ref : _newRef, "reset", (value) => {
    const _val = (!value) ? "" : value;
    const _el = (ref) ? ref.current : _newRef.current;
    _el.value = _val;

    if (typeof validation !== "function") { return; }
    _setIsValid(validation(_val));
    return;
  });

  const _onBlur = (e) => {
    if (typeof onBlur === "function") { onBlur(e.target.value); }
    if (typeof validation !== "function") { return; }
    _setIsValid(validation(e.target.value));
  };

  const _label = (_isValid === true) ? (!label) ? false : placeholder : (_isValid instanceof Error) ? _isValid.message : _isValid.toString();
  const _placeholder = placeholder;
  const _baseInputStyle = { color, backgroundColor: "", border: "", outline: "", appearance: false, size: 1 };
  const _status = (_isValid === true) ? ((disabled) ? "disabled" : (eventName === "focus") ? "focus" : "normal") : "error";
  const _border = (underline !== false) ? ["", "", underline, ""] : border;
  const _isLabel = (() => {
    if (!floatLabel) { return true; }
    if (eventName === "focus") { return true; }
    if (_isValid !== true) { return true;}
    const _ref = (ref) ? ref : _newRef;
    if (!_ref.current) { return false; }
    return _ref.current.value && _ref.current.value.length > 0;
  })();

  return (
    <InputBorder
      color={color}
      size={size}
      label={_label}
      width={width}
      border={_border}
      rounded={rounded}
      status={_status}
      floatLabel={_isLabel}
    >
      <PureComponent
        ref={(ref) ? ref : _newRef}
        tagname={tagname}
        disabled={disabled}
        baseStyle = {_baseInputStyle}
        statusStyle={(disabled) ? { cursor: "not-allowed", ...statusStyle } : statusStyle }
        placeholder={((label && !floatLabel) || eventName === "focus") ? "" : _placeholder}
        onBlur={_onBlur}
        {...props}
      />
      {children}
    </InputBorder>
  );
});

const _TextInput = React.forwardRef(({
  rows=1, // how many number of lines ...
  datalist=[], // "" or [] the autocomplete list ...
  children,
  ...props
}, ref) => {
  const _datalist = Array.from(new Set(forceToArray(datalist)));
  if (_datalist.length === 0){
    <BaseInput ref={ref} tagname={(!rows || rows <= 1) ? "input" : "textarea"} rows={rows} type="text" {...props}>
      {children}
    </BaseInput>
  }

  const _dataListId = React.useId();
  return (
    <BaseInput ref={ref} tagname={(!rows || rows <= 1) ? "input" : "textarea"} rows={rows} type="text" list={_dataListId} {...props}>
      {<datalist id={_dataListId}>{_datalist.map(d => <option key={d} value={d} />)}</datalist>}
      {children}
    </BaseInput>
  );
});

_TextInput.displayName = "TextInput";
export const TextInput = _TextInput;

const _EmailInput = React.forwardRef(({
  children,
  ...props
}, ref) => <BaseInput ref={ref} type="email" {...props}>{children}</BaseInput>);

_EmailInput.displayName = "EmailInput";
export const EmailInput = _EmailInput;

const _NumberInput = React.forwardRef(({
  children,
  ...props
}, ref) => <BaseInput ref={ref} type="number" {...props}>{children}</BaseInput>);

_NumberInput.displayName = "NumberInput";
export const NumberInput = _NumberInput;

const _DateInput = React.forwardRef(({
  children,
  ...props
}, ref) => <BaseInput ref={ref} type="date" {...props}>{children}</BaseInput>);

_DateInput.displayName = "DateInput";
export const DateInput = _DateInput;

const _PasswordInput = React.forwardRef(({
  size = 1, // rem or M() based on Media
  children,
  ...props
}, ref) => {
  const GREY_COLOR = "#aaaaaa";
  const { baseTheme } = useThemeContext();
  const [_inputType, _setInputType] = React.useState("password");
  const OpenEyeIcon = ({ baseStyle }) => (
    <PureComponent
      tagname="svg"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 576 512"
      baseStyle={baseStyle}
      onClick={() => _setInputType("text")}
    >
      <path style={{ stroke: GREY_COLOR, fill: GREY_COLOR }} d="M288 80c-65.2 0-118.8 29.6-159.9 67.7C89.6 183.5 63 226 49.4 256c13.6 30 40.2 72.5 78.6 108.3C169.2 402.4 222.8 432 288 432s118.8-29.6 159.9-67.7C486.4 328.5 513 286 526.6 256c-13.6-30-40.2-72.5-78.6-108.3C406.8 109.6 353.2 80 288 80zM95.4 112.6C142.5 68.8 207.2 32 288 32s145.5 36.8 192.6 80.6c46.8 43.5 78.1 95.4 93 131.1c3.3 7.9 3.3 16.7 0 24.6c-14.9 35.7-46.2 87.7-93 131.1C433.5 443.2 368.8 480 288 480s-145.5-36.8-192.6-80.6C48.6 356 17.3 304 2.5 268.3c-3.3-7.9-3.3-16.7 0-24.6C17.3 208 48.6 156 95.4 112.6zM288 336c44.2 0 80-35.8 80-80s-35.8-80-80-80c-.7 0-1.3 0-2 0c1.3 5.1 2 10.5 2 16c0 35.3-28.7 64-64 64c-5.5 0-10.9-.7-16-2c0 .7 0 1.3 0 2c0 44.2 35.8 80 80 80zm0-208a128 128 0 1 1 0 256 128 128 0 1 1 0-256z"/>
    </PureComponent>
  );

  const CloseEyeIcon = ({ baseStyle }) => (
    <PureComponent
      tagname="svg"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 640 512"
      baseStyle={baseStyle}
      onClick={() => _setInputType("password")}
    >
      <path style={{ stroke: GREY_COLOR, fill: GREY_COLOR }} d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L525.6 386.7c39.6-40.6 66.4-86.1 79.9-118.4c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C465.5 68.8 400.8 32 320 32c-68.2 0-125 26.3-169.3 60.8L38.8 5.1zm151 118.3C226 97.7 269.5 80 320 80c65.2 0 118.8 29.6 159.9 67.7C518.4 183.5 545 226 558.6 256c-12.6 28-36.6 66.8-70.9 100.9l-53.8-42.2c9.1-17.6 14.2-37.5 14.2-58.7c0-70.7-57.3-128-128-128c-32.2 0-61.7 11.9-84.2 31.5l-46.1-36.1zM394.9 284.2l-81.5-63.9c4.2-8.5 6.6-18.2 6.6-28.3c0-5.5-.7-10.9-2-16c.7 0 1.3 0 2 0c44.2 0 80 35.8 80 80c0 9.9-1.8 19.4-5.1 28.2zm9.4 130.3C378.8 425.4 350.7 432 320 432c-65.2 0-118.8-29.6-159.9-67.7C121.6 328.5 95 286 81.4 256c8.3-18.4 21.5-41.5 39.4-64.8L83.1 161.5C60.3 191.2 44 220.8 34.5 243.7c-3.3 7.9-3.3 16.7 0 24.6c14.9 35.7 46.2 87.7 93 131.1C174.5 443.2 239.2 480 320 480c47.8 0 89.9-12.9 126.2-32.5l-41.9-33zM192 256c0 70.7 57.3 128 128 128c13.3 0 26.1-2 38.2-5.8L302 334c-23.5-5.4-43.1-21.2-53.7-42.3l-56.1-44.2c-.2 2.8-.3 5.6-.3 8.5z"/>
    </PureComponent>
  );

  return (
    <BaseInput
      ref={ref}
      type={_inputType}
      size={size}
      {...props}
    >
      <PureComponent
        tagname="div"
        baseStyle={{
          fixed: false,
          size: ["s", 1],
          top: 0,
          right: 0,
          zIndex: 1
        }}
      >
        <PureComponent
          tagname="div"
          baseStyle={{ display: "flex", size: 1, itemPosition: ["end", "center"], padding: [0.5, `${size * baseTheme.fontSize * 0.8}px`] }}
        >
          {(_inputType === "password") ? <OpenEyeIcon baseStyle={{ svgSize: size }} /> : <CloseEyeIcon baseStyle={{ svgSize: size }} />}
        </PureComponent>
      </PureComponent>
      {children}
    </BaseInput>
  );
});

_PasswordInput.displayName = "PasswordInput";
export const PasswordInput = _PasswordInput;

const _Select = React.forwardRef(({
  datalist=[], // "" or [] the autocomplete list ...
  label = true, // true or false
  placeholder = "", // "" 
  validation = true, // true or (val) => return true / "error" / new Error
  color = false, // false or "" or C() or M() based on media
  size = 1, // number or M() based on media
  width = 1, // number or M() based on media
  underline = false, // false or true (default { t: '-', w: 0.2 }) or 1 or {} or M() based on media
  border = false, // false or true (default { t: '-', w: 0.2 }) or 1 or {} or M() based on media
  rounded = false, // false or true (default '[' ) or "[","(","{" or 1 or [tl,tr,br,bl] or M() based on media
  disabled = false,
  baseStyle = {},
  statusStyle = {},
  onBlur=false,
  children,
  ...props
}, ref) => {
  const _datalist = Array.from(new Set(forceToArray(datalist)));
  const _initialSelectValues = (value) => (!value) ? ((_datalist.length === 0) ? false : (_datalist[0] instanceof Object) ? _datalist[0].value : _datalist[0]) : value
  const _newRef = React.useRef(null);
  const { eventName } = useEventListener((ref) ? ref : _newRef, "focus,blur");
  const [_isValid, _setIsValid] = React.useState(true);
  const [_selectValues, _setSelectValues] = React.useState(_initialSelectValues(null));
  useMethod((ref) ? ref : _newRef, "reset", (value) => {
    const _val = _initialSelectValues(value);
    _setSelectValues(_val);

    if (typeof validation !== "function") { return; }
    _setIsValid(validation(_val));
    return;
  });

  const _onChange = (e) => {
    _setSelectValues(e.target.value);
    if (typeof onBlur === "function") { onBlur(e.target.value); }
    if (typeof validation !== "function") { return; }
    _setIsValid(validation(e.target.value));
  };

  const _placeholder = React.useMemo(() => (_isValid === true) ? (!label) ? false : placeholder : (_isValid instanceof Error) ? _isValid.message : _isValid.toString(), [label, placeholder, _isValid]);
  const _baseInputStyle = { color, backgroundColor: "", border: "", outline: "", size: 1 };
  const _status = React.useMemo(() => (_isValid === true) ? ((disabled) ? "disabled" : (eventName === "focus") ? "focus" : "normal") : "error", [_isValid, disabled, eventName]);
  const _border = (underline !== false) ? ["", "", underline, ""] : border;

  return (
    <InputBorder
      color={color}
      size={size}
      label={_placeholder}
      width={width}
      border={_border}
      rounded={rounded}
      status={_status}
      floatLabel
    >
      {
        (_datalist.length === 0) ? null : <PureComponent
          ref={(ref) ? ref : _newRef}
          tagname="select"
          disabled={disabled}
          baseStyle = {_baseInputStyle}
          statusStyle={(disabled) ? { cursor: "not-allowed", ...statusStyle } : statusStyle }
          onChange={_onChange}
          value={_selectValues}
          {...props}
        >
        {
          _datalist.map(opt =>
            (typeof opt === "string") ?
              <PureComponent tagname="option" value={opt}>{opt}</PureComponent> :
                (opt instanceof Object && opt !== null) ? 
                <PureComponent tagname="option" value={opt.value}>{opt.label}</PureComponent>: null)
        }
        </PureComponent>
      }
      {children}
    </InputBorder>
  );
});

_Select.displayName = "Select";
export const Select = _Select;

const _Choice = React.forwardRef(({
  datalist = [], // [str,str, ... ] or [{ label, value }, { label, value }, ... ] the choice
  disabled = false, // false , true or "value" or ["value", "value", ... ] ...
  allowMultipleSelection = false, // true or false (checkbox or radiobox) ...
  defaultValue = [], // the list of selected value
  onChange = (choices) => true, // function callback as per each selection ...
  color = false, // false or "" or C() or M() based on media
  size = 1, // number or M() based on media
  baseStyle = {},
  children,
  ...props
}, ref) => {
  const [_selectedItems, _setSelectedItems] = React.useState(forceToArray(defaultValue));
  const _disabled = (typeof disabled === "boolean" || Array.isArray(disabled)) ? disabled : disabled.toString().split(",");
  const _datalist = Array.from(new Set(forceToArray(datalist)));
  const _onChange = React.useCallback((e) => {
    const _callback = (newSelected) => {
      if (typeof onChange === "function") { onChange(newSelected); }
      return newSelected;
    };

    _setSelectedItems(oldSelected => {
      const _value = e.target.value;
      const _idx = oldSelected.indexOf(_value);
      if (_idx !== -1) { return _callback(oldSelected.filter(item => item !== _value)); }
      else if (!allowMultipleSelection) { return _callback([_value]); }
      return _callback([...oldSelected, _value]);
    });

    return true;
  }, [onChange, allowMultipleSelection]);

  return (
    <PureComponent
      ref={ref}
      tagname="div"
      baseStyle={{ position: "relative", display: "flex", flexWrap: true, gap: 0.25, size: [1, true], itemPosition: ["start", "start"] }}
    >
    {
      _datalist.map((opt, idx) => {
        const _val = (opt instanceof Object && opt !== null) ? opt.value : opt.toString();
        const _label = (opt instanceof Object && opt !== null) ? opt.label : opt.toString();        
        return (
          <PureComponent
            key={idx}
            tagname="label"
            baseStyle={{ userSelect: false, fontSize: size }}
            statusStyle={{ color: (Array.isArray(_disabled)) ? (_disabled.indexOf(_val) !== -1) ? "disabled" : true : (_disabled) ? "disabled" : true }}
          >
            <PureComponent
              tagname="input"
              type="checkbox"
              onChange={_onChange}
              checked={_selectedItems.indexOf(_val) !== -1}
              baseStyle={{ accentColor: color, ...baseStyle }}
              disabled={(Array.isArray(_disabled)) ? _disabled.indexOf(_val) === -1 : _disabled}
              {...props}
            />
            {_label}
          </PureComponent>
        );
      })
    }
    {children}
    </PureComponent>
  );
});

_Choice.displayName = "Choice";
export const Choice = _Choice;

const _Toggle = React.forwardRef(({
  disabled = false, // false, true
  color = false, // false or "" or C() or M() based on media
  size = 1, // number or M() based on media
  rounded = true, // false or true (default '()' ) or "[","(","{" or rem or [tl,tr,br,bl] or M() based on media
  checked = false,
  statusStyle = {},
  children,
  ...props
}, ref) => {
  const [_checked, _setChecked] = React.useState((disabled) ? false : checked);
  const _padding = 0.05;
  return (
    <PureComponent
      tagname="label"
      baseStyle={{ position: "relative", display: "inline-block", size: [size, "r"] }}
    >
      <PureComponent
        ref={ref}
        tagname="input"
        type="checkbox"
        baseStyle={{ opacity: 0, size: 0 }}
        checked={_checked}
        onChange={(e) => (disabled) ? false : _setChecked(c => !c)}
        disabled={disabled}
        {...props}
      />
      <PureComponent
        tagname="span"
        baseStyle={{
          position: "absolute",
          cursor: "pointer",
          fullscreen: true,
          backgroundColor: "#ccc",
          rounded: (rounded === false) ? "[]" : (rounded === true) ? "()" : rounded
        }}
        statusStyle={(_checked) ? { backgroundColor: color, ...statusStyle } : {}}
        transitions={{ all: { duration: 0.4, timeFunction: "ease-out", delay: 0 } }}
      />
      <PureComponent
        tagname="span"
        baseStyle={{
          position: "absolute",
          backgroundColor: (disabled) ? "disabled" : "white",
          width: 0.5 - _padding,
          left: _padding,
          top: 2 * _padding, // w : h = 2 : 1
          bottom: 2 * _padding,
          rounded: (rounded === false) ? "[]" : (rounded === true) ? "()" : rounded
        }}
        statusStyle={(_checked) ? { translate: [1, 0] } : {}}
        transitions={{ all: { duration: 0.4, timeFunction: "ease-out", delay: 0 } }}
      />
      {children}
    </PureComponent>
  );
});

_Toggle.displayName = "Toggle";
export const Toggle = _Toggle;

const _FileUpload = React.forwardRef(({
  disabled = false, // false, true
  color = false, // false or "" or C() or M() based on media
  size = 1, // number or M() based on media
  rounded = false, // false or true or "[],(),{}" or rem or M() based on media
  border = "--", // true or false or "-" or C() or { t, c, w } or [] or M() based on media  
  baseStyle = {},
  statusStyle = {},
  onChange = (files) => true,
  children,
  ...props
}, ref) => {
  const _dropperRef = React.useRef();
  const _newRef = React.useRef();
  const { event, eventName } = useEventListener(_dropperRef, "pointerenter,pointerleave,dragover,dragleave,drop", true);
  const _statusStyle = (eventName === "dragover" || disabled) ? { grayScale: 1, color: "disabled", ...statusStyle } : (eventName === "pointerenter") ? { cursor: "pointer" } : {};
  React.useEffect(() => {
    const _onChange = () => onChange(event.dataTransfer.files[0]);
    if (!disabled && eventName === "drop" && typeof onChange === "function") { _onChange();}
    return () => true;
  }, [disabled, onChange, event, eventName]);

  return (
    <PureComponent
      ref={_dropperRef}
      tagname="div"
      baseStyle={{
        position: "relative",
        display: "flex",
        size,
        itemPosition: "center",
        rounded: (rounded === false) ? "[]" : (rounded === true) ? "()" : rounded,
        background: color,
        userSelect: false,
        border,
        ...baseStyle
      }}
      statusStyle = {_statusStyle}
      onClick={() => {
        if (!disabled) {
          if (ref) { ref.current.click(); }
          else { _newRef.current.click(); }
        }
      }}
    >
      {children}
      <PureComponent ref={(ref) ? ref : _newRef} disabled={disabled} tagname="input" type="file" hidden {...props} onChange={(e) => (typeof onChange === "function") ? onChange(e.target.files[0]) : true}/>
    </PureComponent>
  );
});

_FileUpload.displayName = "FileUpload";
export const FileUpload = _FileUpload;
