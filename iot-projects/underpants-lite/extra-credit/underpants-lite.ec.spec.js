describe('Underpants Lite Extra Credit', function() {
  describe('reduce', function() {
    var inputArray = [10,20,30,40];
    it("Should work with an array and a seed", function() {
      expect(_.reduce(inputArray, function(memo, element, i){
        return memo + element + i;
      }, 10)).to.equal(116);
    });
    it("Should work without a seed", function() {
      expect(_.reduce(inputArray, function(memo, element, i){
        return memo * element * (i+1);
      })).to.equal(5760000);
    });
    it("Should work when seed is falsy", function() {
      expect(_.reduce(inputArray, function(memo, element, i){
        return memo * element * (i+1);
      }, 0)).to.equal(0);
    });
    it("Should not have side effects", function() {
      expect(inputArray).to.eql([10, 20, 30, 40]);
    });
  });

  describe('extend', function() {
    it("Should extend an object.", function() {
      var inputData = { a: "one", b: "two" };
      _.extend(inputData, { c: "three", d: "four" });
      expect(inputData).to.eql({ a: "one", b: "two", c: "three", d: "four" });
    });
    it("Should overwrite existing properties", function() {
      var inputData = { a: "one", b: "two" };
      _.extend(inputData, { a: "three", d: "four" });
      expect(inputData).to.eql({ a: "three", b: "two", d: "four" });
    });
    it("Should handle any number of arguments.", function() {
      var inputData = { a: "one", b: "two" };
      _.extend(inputData, { a: "three", c: "four" }, { d: "five", c: "six" });
      expect(inputData).to.eql({ a: "three", b: "two", c: "six", d: "five" });
    });
  });
});
