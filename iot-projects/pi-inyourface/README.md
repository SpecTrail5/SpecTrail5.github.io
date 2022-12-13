# second-slice-of-pi
Add in middleware to handle data format conversion

**Table of Contents**
 
- [Setup](#setup)
- [Important Information](#important-information)
- [Lesson Steps](#lesson-steps)
    - [TODO 1: Update Server](#todo-1-update-server)
    - [TODO 2: The Converter](#todo-2-the-converter)
    - [TODO 3: Modify Sensor Routes](#todo-3-modify-sensor-routes)
    - [TODO 4: Modify Actuator Routes](#todo-4-modify-actuator-routes)
    - [TODO 5: Test Web Page](#todo-5-test-web-page)

## Setup
* This project should be completed on your Pi. **DO NOT WORK ON THIS PROJECT UNTIL FIRST SLICE OF PI IS COMPLETED**
* Open a new terminal on your Pi (putty or otherwise)
* Enter the command `cd <your GitHub repository's name>` to enter your repository directory
* Enter the command `cd iot-projects` to enter your iot-projects directory
* Enter the command `cp -r first-slice-of-pi/* second-slice-of-pi/.` to copy your first-slice-of-pi's work into second-slice-of-pi's directory
* Enter the command `cd second-slice-of-pi` to enter the new project's directory
* Run the command `npm install onoff node-dht-sensor express cors epoll body-parser xmlhttprequest node-json2html`
* Run `git add -A`
* Run `git commit -m "set up second slice"`
* Run `git push`

## Push Reminder
To push to GitHub, enter the following commands in bash:
```
git add -A
git commit -m "saving first slice of Pi"
git push
```

## Important Information
You must keep your working code on your Pi. However, you can edit your code on any machine, and then use GitHub (or other methods) to move your changes to your Pi for testing.

**To test your code,** you will need to follow the following steps (for all TODOs except TODO 5).
1. Make certain that your terminal (on your Pi) is in your project directory. `cd` into it if you are not.
2. Run the command `node wot-server.js`
3. Open a second terminal
4. Use `curl` commands to send requests to your running server

>**IMPORTANT NOTE:** If a `curl` command crashes your server, you will need to restart it in the first terminal before sending another `curl` request.

## Lesson Steps
This project is the second part of the multi-project undertaking that is setting up a server to allow others to interface with your Pi. For your server itself, you will only be adding in a converter middleware to allow for multiple data formats to be sent back as responses for the server and the necessary changes to support that converter. However, part of this project is writing a script to test that functionality.

### TODO 1: Update Server
This is a small step, but an important one. At the top of your **`servers/http.js`** file, import your middleware converter with `require('./../middleware/converter')` and the body-parser library with `require('body-parser')`. 

Assuming you stored the body-parser library in a variable called `bodyParser`, add the line

```js
app.use(bodyParser.json());
```

just before where you tell Express to use cors, but **AFTER** you create the `app` variable.

Finally, at the end of the file (but before the `module.exports`), add in the line

```js
app.use(converter());
```

The ordering is important, as by putting body-parser first, you ensure that incoming request data is easily readable during routing or converting (it's how you can get `req.accepts` in the converter file). By putting the converter at the end, it lets the routes pass data into the converter.

>**IMPORTANT NOTE:** Be extra certain that there are no mistakes on this TODO, as there is no way to test it yet.

### TODO 2: The Converter
First, let's talk about what is actually happening when someone accesses your server. Whenever someone puts the URL of one of your devices in the browser, your server sends back information about that device to be displayed. What gets sent back is decided on by your server, but by default it is a JSON representation of your device as described in the resources.json file you have, except up to date (i.e., whether or not an LED is on or off).

The first step is to create a converter that will handle sending back responses in the requested data format. This will be in your **`middleware/converter.js`** file. We're only requiring support for two formats, but you can add in more if you want. Just be aware that some formats are harder to work with than others.

<hr>

* **2a)** Check for Results and Send Default

    The first thing that needs to be done in the converter is to check if there is even a result that needs to be sent back from the server. You can do this with the condition

    ```js
    if (req.result) {}
    ```

    If there is not a result to send back, then what you should do instead is call `next()`. Make sure you have this before attempting to process the result with the converter.

<hr>

* **2b)** Check if HTML is requested and send HTML

    Keeping in mind that JSON is the default behavior (meaning it should only be sent back if no other data format was requested), you should now handle the case of HTML data requests. 

    If you have a result to send back, then you can check if HTML is requested with an additional condition:

    ```js
    if (req.accepts('html')){}
    ```

    If HTML is requested, then there are two steps you must follow to send that back. 

    * **2b-i)** The tranformation object

        The first is to create a transformation object for **`json2html`** to use when converting the default JSON object into HTML. Do **NOT** use the code below directly. Instead, note that this object should take on the same form as the below object:

        ```js
        let transform = {'<>': 'div', 'html': [
            {'<>': 'p', 'html': [
                {'<>': 'b', 'html': 'Property1: '},
                {'<>': 'p', 'html': '${property1}'}
            ]},
            {'<>': 'p', 'html': [
                {'<>': 'b', 'html': 'Property2: '},
                {'<>': 'p', 'html': '${property2}'}
            ]},
            {'<>': 'p', 'html': [
                {'<>': 'b', 'html': 'Property3: '},
                {'<>': 'p', 'html': '${property3}'}
            ]}
        ]};
        ```

        However, the three properties that you should use in your transformation object are the `name`, `description`, and `value` of whatever device's information you are sending back, which if you look at your `resources.json` file you will see are properties present in each of your connected devices.

        >**CHALLENGE:** Feel free to add on additional properties, or to change up how the information is displayed (i.e. replace `'b'` with `'h1'`, or put the whole thing in a `<ul>` tag and make the information display in list format).

    * **2b-ii)** The transformation

        Once you have your transformation object created, you need to create some HTML from your result object. The HTML can be generated using a call to `json2html.transform()`. The first argument to `json2html.transform()` should be your result object, and the second should be your transformation object. You can then send back the HTML using `res.send()`. 

        After sending the result, it is good practice to return from the function.

* **2c)** Send back JSON data if HTML is not requested
    
    If there is a result to send back, but HTML is not requested, then the default behavior should be to send back json data. This can be done with the line 

    ```js
    res.send(req.result);
    ```

    This will need to be the body of the `else` corresponding to your check for HTML being requested.

>**IMPORTANT:** This TODO cannot be tested yet, so be very careful with it. After the next TODO is complete, you will be able to test this TODO.

### TODO 3: Modify Sensor Routes
Once you have your converter set up you will need to update your routes to use the converter. First on the list are the sensor routes in **`routes/sensors.js`**.

* **3a)** This step is actually fairly straightforward. Basically, for each of your routes, you should replace the `res.send()` with an assignment to `req.result` and a call to `next()`. i.e.

    ```js
    res.send(resources.pi.sensors);
    ```

    would become

    ```js
    req.result = resources.pi.sensors;
    next();
    ```

    **This needs to be done for all routes in your `sensors.js` file.**

    >**READ:** The purpose of this step is to first store a result (that is the JSON format of your device data) in the request data. When you call `next()`, that's jumping over to the converter (remember how you put `app.use(converter())` after your routes in the `http.js` file), and req is passed along thanks to the Express server.

>**TEST YOUR CODE**
>
>Finally, it's time to test your code. To do so, follow the steps listed at the top of these instructions in the **Important Information** section. Then, enter the following `curl` commands into your second terminal. 
>
>>**WARNING:** If *any* test does not produce the desired response, you *must* find and correct the problem before attempting other tests.
>
>1. curl -X GET -H "Accept:text/HTML" localhost:8484/pi/sensors
>    * You should receive HTML code back as a response. If you do not, then you either did not complete this TODO, or there is an error in your TODO 2's converter code. **THIS SHOULD BE FIXED BEFORE PERFORMING ANY OTHER TESTS**
>2. curl -X GET -H "Accept:text/HTML" localhost:8484/pi/sensors/pir
>    * If you do not receive HTML code back as a response, then you did not update the pir route properly and should take another look.
>3. curl -X GET -H "Accept:text/HTML" localhost:8484/pi/sensors/dht
>    * If you do not receive HTML code back as a response, then you did not update the pir route properly and should take another look.
>4. curl -X GET -H "Accept:text/HTML" localhost:8484/pi/sensors/dht/temperature
>    * If you do not receive HTML code back as a response, then you did not update the pir route properly and should take another look.
>5. curl -X GET -H "Accept:text/HTML" localhost:8484/pi/sensors/dht/humidity
>    * If you do not receive HTML code back as a response, then you did not update the pir route properly and should take another look.
>6. curl -X GET -H "Accept:application/json" localhost:8484/pi/sensors/
>    * If you do not receive json data (an object) back as a response, then that means there is a problem with your converter. 

**DO NOT PROCEED UNLESS ALL TESTS PRODUCE THE DESIRED RESULT**

### TODO 4: Modify Actuator Routes
Here, just do the same thing for the actuator routes that you did for the sensor routes. Once you've done that, you're ready for testing!

>**TEST YOUR CODE**
>
>Before moving on, make certain that these tests also pass. To do so, follow the steps listed at the top of these instructions in the **Important Information** section. Then, enter the following `curl` commands into your second terminal. 
>
>1. curl -X GET -H "Accept:text/HTML" localhost:8484/pi/actuators
>    * You should receive HTML code back as a response. If you do not, then the route was not properly updated.
>2. curl -X GET -H "Accept:text/HTML" localhost:8484/pi/actuators/leds
>    * If you do not receive HTML code back as a response, then you did not update the pir route properly and should take another look.
>3. curl -X GET -H "Accept:text/HTML" localhost:8484/pi/actuators/leds/1
>    * If you do not receive HTML code back as a response, then you did not update the pir route properly and should take another look.
>4. curl -X GET -H "Accept:text/HTML" localhost:8484/pi/actuators/leds/2
>    * If you do not receive HTML code back as a response, then you did not update the pir route properly and should take another look.

**DO NOT PROCEED UNLESS ALL TESTS PRODUCE THE DESIRED RESULT**

### TODO 5: Test Web Page
To really test your changes to your server, you will need to work in the file **`data-requester.html`**. 

* **5a)** Prepare the request

    Inside of the `processForm()` function, you will need to create a new XMLHttpRequest client (i.e. `const xhttp = new XMLHttpRequest()`). You will also need to get the URL that you will be using. Because you are in the processForm function, it is safe to use jQuery to grab the URL from the form. You can do so using the line

    ```js
    const url = $('#host').val();
    ```

    After that use `xhttp.open()` to declare the nature of the request. You should use `"GET"` as your verb, the URL you just got as the URL, and you'll want the request to be asynchronous (it might not even let you send it if it's not).

    Next, set the request header with the header of `"Accept"` and the header value of `"text/html"`. This will let the server check for what data type to send back (in this case HTML). Reminder here that the function call looks like `xhttp.setRequestHeader(header, value);`

    Finally, use `xhttp.send()` to send the request.

* **5b)** Handle readystate changes

    You will need to tell the program how to handle changes to the XMLHttpRequest client's `readyState`. After sending the request, assign to `xhttp.onreadystatechange` a function that accepts no parameters. The body of this function will make use of the `readyState` and `status` to decide what to do.

    If the `readyState` (accessable from the function via `this.readyState`) is `4`, then you should update your page using jQuery. How you should update your page depends on the value of `this.status`.

    * If the status is `200`, then the data exchange was successful and you should update the page to load the received HTML (`$('#data').html(this.responseText)`). 
    * If the status is anything other than `200`, then you should update the page to display `"ERROR"` in its data element instead.

* **5c)** Test your page to make sure it and your server work

    Put in various URLs that should be supported by your server. Start up your server using the command `node wot-server.js`. If you're testing directly on your Pi, keep localhost as the root of your URL. If you are testing on a different machine, you will need to put the IP address of your Pi in place of `"localhost"`. If you are getting back information other than `"ERROR"`, congratulations, you've done it! If you are getting `"ERROR"`, then check with your instructor to see if your issue is with your wires or with your software.
