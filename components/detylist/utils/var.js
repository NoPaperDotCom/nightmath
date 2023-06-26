export const forceToArray = (val = []) => 
  (val === true || val === false || val === "" || val === null) ? [] : 
    (Array.isArray(val)) ? val : 
      (typeof val === "string") ? val.split(",") : 
        [val];
