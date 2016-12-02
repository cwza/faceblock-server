let interMergeObject = (inputObject, defaultObject) => {
  let interMergedObject = Object.assign({}, defaultObject);
  Object.keys(inputObject)
    .filter(inputObjectKey => Object.keys(defaultObject).includes(inputObjectKey))
    .forEach(interSectionKey => {interMergedObject[interSectionKey] = inputObject[interSectionKey]});
  return interMergedObject;
}

let extendObject = (inputObject, defaultObject) => Object.assign({}, defaultObject, inputObject);

module.exports = {
  interMergeObject, extendObject
}
