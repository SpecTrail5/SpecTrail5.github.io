describe('Underpants Lite', function() {

  describe('typeOf', function() {
    it("Should handle strings", function() {
      expect(_.typeOf("a")).to.equal("string");
    });
    it("Should handle numbers", function() {
      expect(_.typeOf(10)).to.equal("number");
    });
    it("Should handle arrays", function() {
      expect(_.typeOf([1,3])).to.equal("array");
    });
    it("Should handle objects", function() {
      expect(_.typeOf({a: "one"})).to.equal("object");
    });
    it("Should handle booleans", function() {
      expect(_.typeOf(false)).to.equal("boolean");
    });
    it("Should handle undefined", function() {
      expect(_.typeOf(undefined)).to.equal("undefined");
    });
    it("Should handle null", function() {
      expect(_.typeOf(null)).to.equal("null");
    });
    it("Should handle functions", function() {
      expect(_.typeOf(function(){})).to.equal("function");
    });
  });

  describe('first', function() {
    it("Should return the first <number> of elements from <array> in a new Array.", function() {
      expect(_.first(["a","b","c"],2)).to.eql(["a","b"]);
      expect(_.first([10,20,30,40,50],3)).to.eql([10,20,30]);
    });
    it("Should return empty array if the array param is not an array.", function() {
      expect(_.first({a:"b"}, 2)).to.eql([]);
      expect(_.first("hi",3)).to.eql([]);
    });
    it("Should return the first element if no numerical argument is given.", function() {
      expect(_.first(["a","b","c"])).to.eql("a");
      expect(_.first([10,20,30,40,50])).to.eql(10);
    });
    it("Should return empty list if numerical argument is not a positive number.", function() {
      expect(_.first(["a","b","c"], -1)).to.eql([]);
      expect(_.first([10,20,30,40,50],-3)).to.eql([]);
    });
    it("Should return the whole array if numerical argument is greater than the array's length.", function() {
      expect(_.first(["a","b","c"], 5)).to.eql(["a","b","c"]);
      expect(_.first([10,20,30,40,50],30)).to.eql([10,20,30,40,50]);
    });
  });

  describe('last', function() {
    it("Should return the last <number> of elements from <array> in a new Array.", function() {
      expect(_.last(["a","b","c"], 2)).to.eql(["b","c"]);
      expect(_.last([10,20,30,40,50],3)).to.eql([30, 40, 50]);
    });
    it("Should return empty array if the array param is not an array.", function() {
      expect(_.last({a:"b"}, 2)).to.eql([]);
      expect(_.last("hi",3)).to.eql([]);
    });
    it("Should return the last element if no numerical argument is given.", function() {
      expect(_.last(["a","b","c"])).to.eql("c");
      expect(_.last([10,20,30,40,50])).to.eql(50);
    });
    
    it("Should return empty list if numerical argument is not a positive number.", function() {
      expect(_.last(["a","b","c"], -1)).to.eql([]);
      expect(_.last([10,20,30,40,50], -3)).to.eql([]);
    });
    it("Should return the whole array if numerical argument is greater than the array's length.", function() {
      expect(_.last(["a","b","c"], 5)).to.eql(["a","b","c"]);
      expect(_.last([10,20,30,40,50],30)).to.eql([10,20,30,40,50]);
    });
    
  });
  
  describe('indexOf', function() {
    var inputData = ["a", "b", "c", "d"];
    it("Should return the correct index when an element is found.", function() {
      expect(_.indexOf(inputData, "b")).to.equal(1);
    });
    it("Should return the index of the first occurance of a found element.", function() {
      expect(_.indexOf(inputData.concat("b"), "b")).to.equal(1);
    });
    it("Should return -1 if the element is not found.", function() {
      expect(_.indexOf(inputData, "e")).to.equal(-1);
    });
    it("Should not have side effects.", function() {
      expect(inputData).to.eql(["a", "b", "c", "d"]);
    });
  });
  
  describe('contains', function() {
    var inputData = [1, "3", 4, 5, "a", "4", "b"];
    it("Should return true if a list contains an element.", function() {
      expect(_.contains(inputData, "a")).to.eql(true);
    });
    it("Should return false if a list doesn't contain an element.", function() {
      expect(_.contains(inputData, "c")).to.eql(false);
    });
    it("Should not convert types when checking.", function() {
      expect(_.contains(inputData, 3)).to.eql(false);
    });
    it("Should not have side effects.", function() {
      expect(inputData).to.eql([1, "3", 4, 5, "a", "4", "b"]);
    });
  });

  describe('each', function() {
    it("Should handle arrays.", function() {
      var inputArray = [1, 2, 3, 4, 5];
      _.each(inputArray, function(e, i, a) {
        inputArray[i] = e * a.length;
      });
      expect(inputArray).to.eql([5, 10, 15, 20, 25]);
    });
    it("Should handle Objects.", function() {
      var inputObject = { a: "1", b: "2", c: "3", d: "4" };
      _.each(inputObject, function(v, k, o) {
        inputObject[v] = k + Object.keys(o).length;
        delete inputObject[k];
      });
      expect(inputObject).to.eql({ 1: "a4", 2: "b4", 3: "c4", 4: "d4" });
    });
  });
  

  describe('filter', function() {
    beforeEach(function() {
      sinon.spy(_, 'each');
      // const each = sinon.spy(_.each);
      sinon.spy(_, 'filter');
    });

    afterEach(function() {
      _.each.restore();
      _.filter.restore();
    });

    var inputData = ["a", 1, "b", 2, "c", 4];
    it("Should filter elements in an array.", function() {
      expect(_.filter(inputData, function(e, i, a) {
        return typeof e === "string" && i < a.length / 2;
      })).to.eql(["a", "b"]);
    });
    it("Should not have side effects.", function() {
      expect(inputData).to.eql(["a", 1, "b", 2, "c", 4]);
    });
    // TODO: Incorporate test to see if each is used
    // xit('should use the _.each function', function() {
    //   var isEven = function(num) { return num % 2 === 0; };
    //   expect(_.each.calledOnce).to.be.false;
    //
    //   _.filter([1, 2, 3, 4, 5, 6], isEven);
    //
    //   console.log('each', _.each);
    //   expect(_.each.calledOnce).to.be.true;
    // });
  });

  describe('map', function() {
    var inputArray = ["a", "b", "c", "d"];
    var inputObject = { a: 1, b: 2, c: 3, d: 4 };
    it("Should map through arrays.", function() {
      expect(_.map(inputArray, function(e, i, a) {
        return e + i * a.length;
      })).to.eql(["a0", "b4", "c8", "d12"]);
    });
    it("Should map through Objects.", function() {
      expect(_.map(inputObject, function(v, k, o) {
        return k + v * Object.keys(o).length;
      })).to.eql(["a4", "b8", "c12", "d16"]);
    });
    it("Should not have side effects.", function() {
      expect([inputArray, inputObject]).to.eql([["a", "b", "c", "d"], { a: 1, b: 2, c: 3, d: 4 }]);
    });
    // TODO: add test to see if each is used
    // xit('should use the _.each function', function() {
    //   console.log(_.map.toString());
    //   expect(_.map.toString()).to.contain('_.each');
    // });
  });
  
  describe('reject', function() {
    var inputData = ["a", 1, "b", 2, "c", 4];
    it("Should reject elements in an array.", function() {
      expect(_.reject(inputData, function(e, i, a) {
          return typeof e === "string" || i < a.length / 2;
      })).to.eql([2, 4]);
    });
    it("Should not have side effects.", function() {
      expect(inputData).to.eql(["a", 1, "b", 2, "c", 4]);
    });
    // TODO: Incorporate test to see if filter is used
  });

  describe('partition', function() {
    var inputData = ["a", 1, "b", 2, "c", 4];
    it("Should reject elements in an array.", function() {
      expect(_.partition(inputData, (e, i, a) => typeof e === "string"))
      .to.eql([["a", "b", "c"], [1, 2, 4]]);
    });
    it("Should not have side effects.", function() {
      expect(inputData).to.eql(["a", 1, "b", 2, "c", 4]);
    });
    // TODO: Add tests to check if filter and reject are used
    // xit('should use the _.filter function', function() {
    //   expect(_.filter.called).to.be.true;
    // });
    //
    // xit('should use the _.reject function', function() {
    //   expect(_.reject.called).to.be.true;
    // });
  });


  describe('every', function() {
    var inputData = [2, 4, 6, 7, 8];
    var inputDataTruthy = [1, [], true, "a"];
    var inputDataFalsy = ["", 0, false, null];
    var inputObject = { a: "one", b: "two", c: "three" };
    it("Should return true when all iterations are true", function() {
      expect(_.every(inputData, function(v) {
        return v % 2 === 0 || v === 7;
      })).to.equal(true);
    });
    it("Should return false when not all iterations are true", function() {
      expect(_.every(inputData, function(v) {
        return v % 2 === 0;
      })).to.equal(false);
    });
    it("Should handle objects", function() {
      expect(_.every(inputObject, function(v, k, o) {
        return ["aone3", "btwo3", "cthree3"].indexOf(k + v + Object.keys(o).length) !== -1;
      })).to.equal(true);
    });
    it("Should return true for truthy results when no function is passed in.", function() {
      expect(_.every(inputDataTruthy)).to.equal(true);
    });
    it("Should return false for falsy results when no function is passed in.", function() {
      expect(_.every(inputDataFalsy)).to.equal(false);
    });
    it("Should not have side effects.", function() {
      expect(inputData).to.eql([2, 4, 6, 7, 8]);
    });
  });

  describe('some', function() {
    var inputData = [2, 4, 6, 7, 8];
    var inputDataTruthy = [1, [], true, "a"];
    var inputDataFalsy = ["", 0, false, null];
    var inputObject = { a: "one", b: "two", c: "three" };
    it("Should return true when at least one iteration is true", function() {
      expect(_.some(inputData, function(v) {
        return v === 7;
      })).to.equal(true);
    });
    it("Should return false when no iterations are true", function() {
      expect(_.some(inputData, function(v) {
        return v > 10;
      })).to.equal(false);
    });
    it("Should handle objects", function() {
      expect(_.some(inputObject, function(v, k, o) {
        return ["aone3", "btwo3"].indexOf(k + v + Object.keys(o).length) !== -1;
      })).to.equal(true);
    });
    it("Should return true for truthy results when no function is passed in.", function() {
      expect(_.some(inputDataTruthy)).to.equal(true);
    });
    it("Should return false for falsy results when no function is passed in.", function() {
      expect(_.some(inputDataFalsy)).to.equal(false);
    });
    it("Should not have side effects.", function() {
      expect(inputData).to.eql([2, 4, 6, 7, 8]);
    });
    
    describe('pluck', function() {
    var inputData = [{ name: "Ralph", age: 22 }, { name: "Jimmy", age: 13 }, { name: "Carla", age: 20 }];
    it("Should pluck properties out of a list of objects.", function() {
      expect(_.pluck(inputData, "name")).to.eql(["Ralph", "Jimmy", "Carla"]);
    });

    it("Should not have side effects.", function() {
      expect(inputData).to.eql([{ name: "Ralph", age: 22 }, { name: "Jimmy", age: 13 }, { name: "Carla", age: 20 }]);
    });

  });
  });
});
