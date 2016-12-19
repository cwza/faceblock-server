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
  OBJECT_NOT_FOUND: 404,
  PAGE_NOT_FOUND: 404,
  VALIDATION_ERROR: 400,
  CONFLICT_OBJECT: 409,
  OTHER_ERROR: 500,
}

module.exports = {
  PARAMS, NO_NEXT_PAGE, ERROR
}
