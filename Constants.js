const PARAMS = {
  ORDER: {
    ASC: 'asc',
    DESC: 'desc'
  },
  SORT: {
    CREATE_TIME: 'createTime',
    ID: 'id',
    SCORE: 'score'
  },
};

const NO_NEXT_PAGE = 'NO_NEXT_PAGE';

const ERROR = {
  OBJECT_NOT_FOUND: {
    name: 'OBJECT_NOT_FOUND',
    code: 404,
  },
  PAGE_NOT_FOUND: {
    name: 'PAGE_NOT_FOUND',
    code: 404,
  },
  VALIDATION_ERROR: {
    name: 'VALIDATION_ERROR',
    code: 400,
  },
  CONFLICT_OBJECT: {
    name: 'CONFLICT_OBJECT',
    code: 409,
  },
  OTHER_ERROR: {
    name: 'OTHER_ERROR',
    code: 500,
  }
}

module.exports = {
  PARAMS, NO_NEXT_PAGE, ERROR
}
