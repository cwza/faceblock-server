const expect = require('chai').expect;
const utils = require('./utils');

describe('utils', function() {
  describe('#utils.interMergeObject()', function() {
    it('should return interMergedObject', function() {
      let defaultObject = {name: 'aaa', id: 11, date: 1215};
      let inputObject = {name: 'bbb', id: 2, verbose: 'xxxx'};
      let expectedObject = {name: 'bbb', id: 2, date: 1215};
      let interMergedObject = utils.interMergeObject(inputObject, defaultObject);
      expect(interMergedObject).to.deep.equal(expectedObject);
    });
  });
});
