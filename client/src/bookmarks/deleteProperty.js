export const deleteProperty = (objParam, key) => {
  let obj = { ...objParam };
  for (let property in obj) {
    if (!obj.hasOwnProperty(property)) continue;
    if (property === key) {
      obj[property] = undefined;
    } else if (typeof obj[property] === 'object') {
      const nestedObj = deleteProperty(obj[property], key);
      obj = { ...obj, [property]: nestedObj };
    }
  }
  return obj;
};
