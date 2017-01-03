let otherError = (error={}) => {
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

let validationError = (error={}) => {
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

let authenticationError = (error={}) => {
  return {
    status: 401,
    errorCode: 401,
    name: 'AUTHENTICATION_ERROR',
    message: 'AUTHENTICATION_ERROR',
    longMessage: JSON.stringify(error),
  }
}

let authorizationError = () => {
  return {
    status: 403,
    errorCode: 403,
    name: 'AUTHORIZATION_ERROR',
    message: 'AUTHORIZATION_ERROR',
  }
}

module.exports = {
  otherError, pageNotFound, objectNotFound, validationError, conflictObject, authenticationError,
  authorizationError
}
