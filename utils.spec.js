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
  describe('#utils.deletePropertiesFromObject()', function() {
    it('should return interMergedObject', function() {
      let obj = {name: 'cwz', id: 1, mail:'mail', other: 'xxx'};
      let expectedObj = {name: 'cwz', mail:'mail'};
      let returnedObj = utils.deletePropertiesFromObject(obj, ['id', 'other']);
      expect(returnedObj).to.deep.equal(expectedObj);
    });
  });
});
