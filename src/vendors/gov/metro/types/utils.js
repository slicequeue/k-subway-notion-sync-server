
function getCodeKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

function getCodeValues(code) {
  return Object.values(code);
}

function getCodeKeys(code) {
  return Object.keys(code);
}

module.exports = {
  getCodeKeyByValue,
  getCodeValues,
  getCodeKeys,
}
