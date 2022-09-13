# Underpants
This activity is essentially a re-write of [underscore.js](http://underscorejs.org/).

## Why?
In the past exercises we've been writing a lot of loops over objects and arrays ourselves. Instead of doing that, we are going to write several fuctions to handle the looping for us. These functions are used every day by professional developers and we're well on our way to becoming professional developers!!

This means that if we're confused about how a function should work, we can check the underscore.js documentation linked above for help.

## Instructions
 - Open up index.html in a web browser.
 - Notice that all the tests are failing. :)
 - Open up underpants-lite.js in a text editor and follow the instructions.
 - Make all the tests pass!!

## Links and Resources

Some quick notes that may come in handy:

- [underscore documentation](http://underscore.js).
- Many of the functions operate on "collections." They can take both arrays or
  objects as their arguments and you need to be able to handle both cases.
    - You can use `Array.isArray(obj)` to find out whether an object is an array.
    - You can use `obj.length` to test if something is either a string or an
      array.
- Javascript has a built-in `Math` object that provides some very useful
  functions. [Math Documentation](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Math).
- Within a function, you can use the `arguments` variable to access all the
  parameters that were passed in even if they aren't named in the function
  definition. This is useful if you don't know how many arguments are going to
  be passed in in advance.
    - You can count the arguments by using `arguments.length` and access each
      argument using `arguments[i]`.
    - The `arguments` object is very similar to an array, but note that it does
      not support most array functions (such as `slice` or `push`). You can read
      more about this [here](http://www.sitepoint.com/arguments-a-javascript-oddity/).

### Extra Credit:
See Instructor for instructions.
- defaults
- *once*
- memoize
- delay
- shuffle

### Double Extra Credit:
See Instructor for instructions.
- once
- invoke
- sortBy
- zip
- flatten
- intersection
- difference
- throttle

**Note:** Some browsers provide built-in functions--including `forEach`, `map`,
`reduce` and `filter`--that replicate the functionality of some of the functions
you will implement. Don't use them to implement your functions.
# underpants-lite
