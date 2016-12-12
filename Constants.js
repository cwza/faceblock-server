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
  NEAR_CONDITION: {
    UPPER_NEARID: '>',
    UNDER_NEARID: '<'
  }
};

const NO_NEXT_PAGE = 'NO_NEXT_PAGE';

module.exports = {
  PARAMS, NO_NEXT_PAGE
}
