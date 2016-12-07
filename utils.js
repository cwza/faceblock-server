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

let replaceUrlParam = (url, paramName, paramValue) => {
    if(paramValue == null)
        paramValue = '';
    var pattern = new RegExp('\\b('+paramName+'=).*?(&|$)')
    if(url.search(pattern)>=0){
        return url.replace(pattern,'$1' + paramValue + '$2');
    }
    return url + (url.indexOf('?')>0 ? '&' : '?') + paramName + '=' + paramValue
}

let genNextPageUrl = (url, page) => {
  return replaceUrlParam(url, 'page', page + 1);
}

module.exports = {
  interMergeObject, extendObject, deletePropertiesFromObject, genNextPageUrl
}
