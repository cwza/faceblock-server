let interMergeObject = (inputObject, defaultObject) => {
  let interMergedObject = Object.assign({}, defaultObject);
  Object.keys(inputObject)
    .filter(inputObjectKey => Object.keys(defaultObject).includes(inputObjectKey))
    .forEach(interSectionKey => {interMergedObject[interSectionKey] = inputObject[interSectionKey]});
  return interMergedObject;
}

let extendObject = (inputObject, defaultObject) => Object.assign({}, defaultObject, inputObject);

let deletePropertiesFromObject = (obj, properties) => {
  let returnedObj = {};
  Object.keys(obj)
    .filter(key => !properties.includes(key))
    .forEach(key => returnedObj[key] = obj[key]);
  return returnedObj;
}

module.exports = {
  interMergeObject, extendObject, deletePropertiesFromObject
}
