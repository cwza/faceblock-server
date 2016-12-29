let otherError = (error) => {
  return {
    status: 500,
    errorCode: 500,
    name: 'OTHER_ERROR',
    message: error.message,
    longMessage: JSON.stringify(error),
  }
}

let pageNotFound = () => {
  return {
    status: 404,
    errorCode: 404,
    name: 'PAGE_NOT_FOUND',
    message: 'PAGE_NOT_FOUND',
  }
}

let objectNotFound = () => {
  return {
    status: 404,
    errorCode: 404,
    name: 'OBJECT_NOT_FOUND',
    message: 'OBJECT_NOT_FOUND',
  }
}

let validationError = (error) => {
  return {
    status: 400,
    errorCode: 400,
    name: 'VALIDATION_ERROR',
    message: error.message,
  }
}

let conflictObject = () => {
  return {
    status: 409,
    errorCode: 409,
    name: 'CONFLICT_OBJECT',
    message: 'CONFLICT_OBJECT',
  }
}

module.exports = {
  otherError, pageNotFound, objectNotFound, validationError, conflictObject
}
