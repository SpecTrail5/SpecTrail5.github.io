# are-you-being-served
PROJECT: Creating a pair of servers that perform different tasks

**Table of Contents**
 
- [Setup](#setup)
- [Lesson Steps](#lesson-steps)
    - [Request Server](#request-server)
        - [TODO 1: Initialize Variables](#todo-1-initialize-variables)
        - [TODO 2: Basic Request Server](#todo-2-basic-request-server)
        - [TODO 3: request Callback Function](#todo-3-request-callback-function)
        - [TODO 4: Test Your Server](#todo-4-test-your-server)
        - [TODO 5: Generalize With Command Line Arguments](#todo-5-generalize-with-command-line-arguments)
        - [TODO 6: Allow for Plain Text Responses](#todo-6-allow-for-plain-text-responses)
    - [Parallel Server](#parallel-server)
        - [TODO 7: Get Start Time](#todo-7-get-start-time)
        - [TODO 8: Create Wrapper Function](#todo-8-create-wrapper-function)
        - [TODO 9: Add the Function List](#todo-9-add-the-function-list)
        - [TODO 10: Write the Async Callback](#todo-10-write-the-async-callback)
        - [TODO 11: Test Your Race Server](#todo-11-test-your-race-server)
        - [TODO 12: Make it Parallel](#todo-12-make-it-parallel)

## Setup
* Enter the command `cd iot-projects` to enter your "iot-projects" directory
* Enter the command `cd are-you-being-served` to enter this project's directory
* Run the command `npm install request async` to install the libraries we will be using during this project

## Push Reminder
To push to GitHub, enter the following commands in bash:
```
git add -A
git commit -m "saving are-you-being-served"
git push
```

## Lesson Steps
There are two separate servers that you will be creating. One of them make use of the request library, the other will use the async library. The server using the request library will generate a copy of an existing web page. The other server will make use of parallel processes to host a race between virtual competitors.

<hr>

## Request Server
The request server makes use of the "request" library to grab the HTML code from a specified website and display it, either as raw text or the actual rendered web page. You will also make use of command line arguments.

### TODO 1: Initialize Variables
* **1a)** Import both the "http" and the "request" libraries using `require()`. 
* **1b)** Store the libraries in `const` variables named `http` and `request`, respectively.
* **1c)** Initialize a variable called `port` to store the port number (**8686** is a good number, but you can use a different one if you'd rather).

### TODO 2: Basic Request Server
* **2a)** Create an HTML server (use the slides as reference if needed). Remember to specify which `port` to use.

```js
// example http server creation
http.createServer(requestListenerFunction).listen(portNumber);
```

>**REMINDER:** Recall that the **request listener** function has two parameters: `req` and `res`. These are for the **request** heading into the server and the **response** that the server should send back, respectively. 

* **2b)** Create the request listener function. In this server's **request listener** function, there should be only one command: a `request()` call with the first argument being the URL to your github home page (i.e. `https://<username>.github.io`). 

>**WARNING:** Be careful not to confuse a `request()` call with the server's request variable, `req`, as these are two very different things.
>
>An example `request()` call is below:
>
>```js
>// example request call
>request('http://url.com', callbackFunction);
>```

* **2c)** Create the `request` callback function: The `request()`'s **callback function** is where most of your work will be. For now, simply make the callback function's skeleton. You will fill in the body of the function in TODO 3. Below is the information necessary to create the skeleton. 

    >**CODE:** 
    >* **Name:** none
    >* **Parameters:** `error`, `response`, and `body`. 
    
    <br>

    >**NOTE:** This `response` parameter is different from the http server's response variable, `res`. The `request()`'s `response` parameter is something you are receiving from a *remote* server. Your http server's `res` variable is something you are creating to send back as your response to someone visiting *your* server. *Be very careful not mix up the `res` and `response variables.*

### TODO 3: `request` Callback Function
Here is where you need to create the body of the callback function for the `request()` call. The callback function passed to the `request()` call should be what generates the **server's response** (aka, it should be what adds on to the `res` variable). Before you do anything else, however, you must make sure that the request ever even went through. 

* **3a)** Check that you properly sent a request and received a response by adding in the following code at the beginning of your callback function:

```js
if (!body || !response || (error === null && response.statusCode !== 200)){
    res.end("bad URL\n");
    return;
}
```

>**READ:** Now, you will need to handle two separate cases. The code for these two cases should go *after* the conditional code provided to you above. It's up to you to figure out the exact conditions, but we will provide you with a description of what you need.

* **3b)** SCENARIO 1: If the status code returned by the request (found via `response.statusCode`) is `200` and there were no errors (easily checked by seeing that `!error === true`), the callback should do the following:

   1. it should specify the header of the response variable `res` to have a status code of `200` (meaning ok) and set the content-type to be "text/html" (use `res.writeHead()`)
   2. it should write the `body` of the HTML returned as its response (use `res.write()`)

<br>

* **3c)** SCENARIO 2: If scenario 1 did not occur, then the callback should instead do the following:

   1. it should specify the header of the response to have a status code of `response.statusCode` and set the content-type to be "text/plain"
   2. it should write the error as your response (you can simply "write" the `error` parameter using `error.toString()`)

<br>

* **3d)** Finally, after both scenarios are taken care of, the callback should also end the response with a call to `res.end()`. 

### TODO 4: Test Your Server

This step will walk you through how to test your server.

**TO CHECK YOUR DIRECTORY** 
Make sure you are in the "are-you-being-served" directory in your terminal. You can check this by typing `pwd` in the terminal. If it prints out the path to your "are-you-being-served" directory, you're in the right place!

**TO CHANGE YOUR DIRECTORY** 
If you aren't in the correct directory (or folder in Windows), you will need to change to that directory. You can do that by typing `cd <new-directory>`. You can either type out the entire path to your "are-you-being-served" directory in place of "new-directory", or you can type in a relative directory name in place of "new-directory". For instance, if you are in the "Home" directory and there is a subdirectory named "Desktop", you can switch to the "Desktop" directory by typing `cd Desktop`. If you need to go up instead of down in the directory list, type `cd ..`.

**TO TEST YOUR SERVER** 
Once you are in the correct directory, you can run your server by typing `node requestServer.js`. Then, open up a browser tab to `localhost:<port number>` to see if it worked!

### TODO 5: Generalize With Command Line Arguments
Your new server is neat and all, but it would be even better if you could make the server request different web pages depending on how you configure it at start up. You can do that with command line arguments. 

><details> <summary> Click here for a command line argument overview </summary>
>
>Here's a quick rundown on command line arguments. Any time you type a command into the terminal (i.e. `cd Desktop`), you execute a program (in this case, the `cd` program). The entire command that you type is then given to the program in the form of an array. For instance, `cd Desktop` would become the array `["cd", "Desktop]`. This is true of any command, so if you type `node requestServer.js`, then your server is given an array holding `["node", "requestServer.js"]`. In JavaScript, this data is stored in a built-in variable named `process.argv`.
>
>Your command can be as long as you like, and this enables you to give your program additional data at the start. 
></details>

>**READ:** With command line arguments, if you were to type `node requestServer.js https://dkogler.github.io`, then `"https://dkogler.github.io"` would be added to the array of data passed into the program.
>
>In the JavaScript of your program, if you were to add the line `var args = process.argv;` at the start of your code, then you would store the command line array in the variable `args`. However, we don't need the first two elements of this array, as they will always be `"node"` and `"requestServer.js"`. Those two values aren't very useful to us. What would be helpful is a way to get rid of the un-useful data.

* **5a)** Add the following line instead to grab only the command line arguments that we care about:

    ```js
    // add to the beginning of your program
    var args = process.argv.slice(2);
    ```

    This will only store any extra data that we give to our program that we might want to use to configure the server. So now, if you were to type `node requestServer.js https://wikipedia.com`, then `args` would store `["https://wikipedia.com"]`, which means you can use that URL in your program! 

* **5b)** Now that we have support for command line arguments, you should update your `createServer()` function to have the following line in its **request listener** function:

    ```js
    var url = args[0] ? args[0] : "<a default url>";
    ```

    where `"<a default url>"` can be whatever page you want (like your portfolio page, for example). Don't forget to also update your `request()` call to use this new URL!

### TODO 6: Allow for Plain Text Responses
>**NOTE: This TODO is a bonus challenge and is not required for completion**

The final step for this first server is to give support for it to return the HTML code of the requested website as plaintext instead of a rendered HTML page. This can be done via further command line support. Instead of simply having an additional command line argument for a custom URL, you can give support for two additional arguments, with the second one being whether or not to return HTML code or plain text.

Try to figure out how to add this support in on your own. Remember that `res.writeHead()` is where you specify the format of the returned data, and you should only need to change that format in the case of a successful response.

<hr>

## Parallel Server
The second server you are going to create will host a race between virtual racers. The skeleton for this server has already been written, as has a function that will select the winners. Your goal is to write the code that will time the race, send each racer off on their journey, and write the results in the response sent back by the server.

### TODO 7: Get Start Time
You will need to make use of the built in object class `Date` to handle timing. To do so, all you need to do is create a new `Date` object and grab the time from that object. 

* **7a)** Create a `Date` object and use it to get the current time with the following code:

```js
let d = new Date();
let startTime = d.getTime();
```

You might not know what `new Date()` does, but it essentially creates an object of class **Date**. You are using what is called a **constructor** to produce the object. If it helps, you can think of it as a special kind of factory function.

### TODO 8: Create Wrapper Function
We want the race to be fair for all racers, so they should all run the same race. To do so, you are going to create a function that will simulate running a race by calling the `setTimeout()` function. The details of this function are as follows:

>* **Name:** `wrapper`
>* **Parameters:**
>    * `callback`: a function that will store results for recovery later
>* **Returns:** Nothing
>* **Description:** `wrapper` has one job in this program:
>    * Call the `setTimeout()` function with two arguments:
>        1. The first argument is a function with the following properties:
>           >* **Parameters:** None
>           >* **Description:**
>           >   * It first creates a new `Date` object stored in a new variable called `d`
>           >   * It next calls the callback function passed into wrapper; give the callback function the arguments `null` and `d.getTime()`. `null` tells the callback that no errors occurred, and `d.getTime()` stores the exact time (to the millisecond) that the function ran.
>        2. The second argument is simply `Math.random()*1000`

* **8a)** Create the `wrapper` function as described above.

### TODO 9: Add the Function List
Right now, the call to `async.series()`'s first argument is an empty array. 

* **9a)** You need to populate that array with four identical functions that have the following characteristics:

    * take a single parameter called "callback"
    * call the function `wrapper()`, passing `callback` as an argument to the `wrapper()` function.

### TODO 10: Write the Async Callback
The `async.series` function also has a callback function. It goes directly after the array of functions. This callback is where you will want to generate your http server's response..

<hr>

* **10a)** The Preamble: Simply write `res.write("Results:\n");` on the first line of your callback's body. 

>**EXPLANATION:** This will make the line `"Results:"` be part of the response you send back from the `res` variable. You don't need to worry about using `res.writeHead()`, as that has already been provided in the code up on line 7 (unless you have added or removed lines, of course).

<hr>

* **10b)** The Racers Loop: After the header, write the command 

    var victoryOrder = sortTogether(racers, results); 

>**EXPLANATION:** This will sort all of your racer names based on the times recorded in the `results` array. While the `sortTogether()` function has been provided for you, you should still take the time to look over its code and try to understand what it is doing. You may need to do a Google search for "Array.sort()" for it all to make sense.

<hr>

* **10c)** After calling `sortTogether()`, use a loop to iterate over the array `victoryOrder`.

<hr>

* **10d)** The Racers Response: Inside of the loop, write the racer names to your server's response. You will need to add the string `"\n"` after each name (`"\n"` is a special character that means "new line", and is essentially hitting the "enter" key in your response).

<hr>

* **10e)** The Race Time: Now outside of the loop, create a new `Date` object (place it in a variable called `d` again). Then, use the `.getTime()` method of `Date` objects (refer to how you used `d.getTime()` earlier) to get the end time for the race. You might want to store the new time in a variable called `endTime`. 

<hr>

* **10f)** Finally, write the duration of the entire race into the response, which you can get by subtracting your start time (created back in TODO 7) from your end time. Since this is the last part of your message, you should use `res.end()`.

>**WARNING:** You will have to convert the time into a string. The recommended approach is to append `"\n"` to the time using the concatenation operator. For instance, `duration + "\n"`, where `duration` is the result of subtracting `startTime` from `endTime`.

>**HINTS:** 
>1) You get the end time in **10f**, but you created the start time back in TODO 7. If you don't remember the variable name, go look it up to make sure that you get it right.
>2) Don't forget that you must use `res.end()` even if you write the last bit of your message using `res.write()`! If you don't, then the response will never be sent!

### TODO 11: Test Your Race Server
You can test your race server the same way you tested your request server. However, if you want to get the results of multiple requests a bit faster, you can do so by using cURL. You will need to open up a separate terminal from the one that you are running your server in and simply type `curl localhost:8686` (assuming you didn't change the port number). 

What do you notice? Does there seem to be any randomness in the order that the racers are finishing?

### TODO 12: Make it Parallel
* **12a)** Change the async call from `async.series()` to `async.parallel()`. Try testing your server again. 

Do you notice anything different about the results now? How about the time it takes for the race to complete? What you are seeing are the effects of running several functions in parallel instead of in sequence. We use the `setTimeout()` function to make the differences a bit more obvious, but if you were running functions with heavy workloads instead of `setTimeout()` you would see the same results.

### Bonus
Change your `wrapper()` function so that instead of calling `setTimeout()`, it executes a `for` loop a random number of times before calling `callback()`. To really see the effects, a double for loop might be preferable. For instance:

```js
var rand = Math.random();
for (var i = 0; i < 1000; i++){
    for (var j = 0; j <  rand * 1000000; j++){
        // do some random math
    }
}
```

If you give a workload similar to or greater than the one in the above example, you can switch back and forth between calling `async.parallel()` and `async.series()` to see just how much of a difference time-wise running in parallel can make.
