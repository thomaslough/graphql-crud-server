const mockDB = {
  testDict: {},
  add: function (query, result) {
    query.toLowerCase();
    if (this.testDict[query] === undefined) {
      this.testDict[query] = result;
    }
  },
  result: function (query) {
    query.toLowerCase();
    const result =
      this.testDict[query] !== undefined ? this.testDict[query] : null;
    return result;
  },
};

module.exports = mockDB;
