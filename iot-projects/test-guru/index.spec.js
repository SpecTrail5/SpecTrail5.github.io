var sinon;
var expect;
if ((typeof process !== 'undefined') &&
  (typeof process.versions.node !== 'undefined')) {
  // here, export any references you need for tests //
  sinon = require('sinon');
  expect = require('chai').expect;
}

describe("Test Guru", function () {
  
  /* global expect, sinon*/
  
  beforeEach(function () {
    sinon.spy(console, 'log');
  });

  afterEach(function () {
    console.log.restore();
  });

  it('Our First Test', function () {
    var value = "hello tests";
    var some_number = 484;

    //                 ┌ Change this to what it should be
    expect(value === '???').to.be.true;
    
    //                        ┌ Change this to what it should be
    expect(some_number === '???').to.be.true;
  });

  it("Functions can access/modify variables in parent scope.", function(){
    var outside_the_function = null;
    function yay(){
      var inside_the_function = "can you see me?";
      outside_the_function = inside_the_function;
    }

    yay();
    
    expect(outside_the_function === '???').to.be.true;
  });

  it("Function Parameters become scoped to the function.", function(){

    function yay(param){
      expect(param === '???').to.be.true;
    }

    yay("a fine kettle of fish");
  });

  it("A functions local scope is not available in an outer scope.", function(){
    function yay(){
      var kix = "kid tested mother approved";
      expect(kix === '???').to.be.true;
    }
    yay();
    
    var has_kix;
    // NOTE:
    // "this" is a special object that by default represents the global scope.
    // variables declared globally are stored as a property on the object: this.<variable>
    // if the variable is not global then this.<variable> will be undefined
    if(this.kix !== undefined){
      has_kix = kix;
    } else {
      has_kix = "i prefer cheerios";
    }
    expect(has_kix === '???').to.be.true;
  });

  it("Functions don't have access to eachothers scope", function(){
    function yay(){
      var from_yay = "i'm inside yay;";
    }

    function foo(){
      var in_foo = "i'm in foo";
      if(this.from_yay !== undefined){
        in_foo = this.from_yay;
      }
      expect(in_foo === '???').to.be.true;
      expect(this.from_yay === '???').to.be.true;
    }
    yay();
    foo();
  });

  it("Inner scope variables have preference over outter scope variables with the same name.", function(){

    var peanuts = 300;

    function yay(){
      var peanuts = "roasted";

      expect(peanuts === '???').to.be.true;
    }
    yay();

    expect(peanuts === '???').to.be.true;
  });

  it("Variables created with var in a function are re-created each time", function(){
    function yay(){
      if(this.counter !== undefined){
        counter = counter + 1;
      } else {
        var counter = 10;
      }
    }

    yay();
    expect(this.counter === '???').to.be.true;
    yay();
    expect(this.counter === '???').to.be.true;
    yay();
    expect(this.counter === '???').to.be.true;
  });

  it("Inner scope can access outer scope", function(){
    var im_outside = "alpha";
    function yay(){
      var im_inside = "omega";
      return im_outside + im_inside;
    }

    expect(yay() === '???').to.be.true;
  });

  it("Functions retain outer scope references between calls.", function(){
    var im_outside = 13;
    function yay(){
      im_outside += 1;
    }

    yay();
    expect(im_outside === '???').to.be.true;
    yay();
    expect(im_outside === '???').to.be.true;
  });

  it("We can do goofy stuff with outer scope", function(){

    var hello = "greg";
    var name = "";

    function yay(){
      name += hello;
    }

    yay();
    expect(name === '???').to.be.true;
    yay();
    expect(name === '???').to.be.true;
    yay();
    expect(name === '???').to.be.true;

  });

  it("We can pass functions to other functions and then run them.", function(){
    var im_outter = 10;
    function yay(){
      im_outter /= 5;
    }
    function something(whatever){
      im_outter *= 20;
      whatever();
    }
    something(yay);
    
    expect(im_outter === '???').to.be.true;
  });

  it("We can get crazy with returns.", function(){
    function yay(){
      return " is dog";
    }
    function foo(whatever){
      return "hello, this" + whatever();
    }

    expect(foo(yay) === '???').to.be.true;
  });
});
