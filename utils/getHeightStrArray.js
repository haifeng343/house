export default (str, keyword) =>
  str
    .replace(new RegExp(`${keyword}`, "g"), `%%${keyword}%%`)
    .split("%%")
    .filter(item => !!item);
