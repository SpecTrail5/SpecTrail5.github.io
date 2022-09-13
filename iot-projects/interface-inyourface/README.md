# interface-inyourface
PROJECT: Designing a series of websites that make use of various interface techniques

**Table of Contents**
 
- [Setup](#setup)
- [Lesson Steps](#lesson-steps)
    - [Polling Web Page: ](#polling-web-page)
        - [TODO 1: Initialize Records Variables](#todo-1-initialize-records-variables)
        - [TODO 2: Update Records Functions](#todo-2-update-records-functions)
        - [TODO 3: Regular Polling](#todo-3-regular-polling)
        - [TODO 4: WebSocket Polling](#todo-4-websocket-polling)
    - [Actuator Form Web Page](#actuator-form-web-page)
        - [TODO 5: Actuator AJAX POST](#todo-5-actuator-ajax-post)
    - [Device Parser Web Page](#device-parser-web-page)
        - [TODO 6: Device Parser AJAX GET](#todo-6-device-parser-ajax-get)
        - [TODO 7: Generate Sensors URL](#todo-7-generate-sensors-url)
        - [TODO 8: Device Parser AJAX Success](#todo-8-device-parser-ajax-success)
    
## Setup
* Enter the command `cd iot-projects` to enter your "iot-projects" directory so that you will be ready to push your work at the end of your work session.

## Push Reminder
To push to GitHub, enter the following commands in bash:
```
git add -A
git commit -m "saving interface-inyourface"
git push
```

## Lesson Steps
We have three separate web pages that we will be creating. One will demonstrate two separate polling methods for obtaining device data, one will demonstrate sending data to a device using AJAX, and the third will demonstrate a request for device information using AJAX.

>**IMPORTANT:** All of the TODOs for this project have a pre-labeled section in their corresponding files telling you where to work. This is because the files are fairly large, and you only need to work on some parts of them. As such, the first thing that you should do for each TODO is find the comment saying `TODO 1`, `TODO 2`, etc.

<hr> 

## Polling Web Page
This web page will be split into four pieces of functionality. There will be two charts that display temperature readings taken over time, and there will be two separate displays of high and low temperatures taken using each method. On the left half of the screen will be the chart detailing temperature readings taken every ten seconds, as well as the highest and lowest temperatures recorded using this method. On the right half of the screen will be the chart detailing temperature readings taken in real time, along with the corresponding highest and lowest recorded temperatures.

### TODO 1: Initialize Records Variables
We want to keep track of the highest and lowest recorded temperatures. Because we are recording temperatures in two separate ways, we need four variables: two for the regular polling, and two for the WebSocket polling (highest and lowest for each polling method). We'll want our highest values to start at a ridiculously low value in case we only record low temperatures (the thermometer might be inside a freezer, after al), and we'll want to initialize our lowest values to a ridiculously high number for similar reasons.

* **1a)** Add in the variables `regHighest`, `regLowest`, `wsHighest`, and `wsLowest` to your code. Set the initial high values to be `-500` and the initial low values to be `500`. 

    The `regHighest` and `regLowest` variables will store the highest and lowest values recorded from regular polling. The `wsHighest` and `wsLowest` variables will store the highest and lowest values recorded from WebSocket polling.

* **1b)** Next, use jQuery to add a new element to the web page that will display the highest recorded "regular polling" value for us. You can add this with the following line:

    ```js
    $('#reg-chart-container').append($("<p>").attr("id", "reg-highest").text("Highest recorded value is " + regHighest));
    ```

    Here, `#reg-chart-container` is the id for the div we are adding the new element to. The new element is a `<p>` with the id of `"reg-highest"`.

* **1c)** Once you've created the element for the highest recorded value (`regHighest`), you will need to create **three more elements** corresponding to the other three variables. The other three elements can be added in using code similar to that of **1b**. Use the id of `"reg-lowest"` for the lowest regular polling temperature and the ids of `"ws-highest"` and `"ws-lowest"` for the WebSocket high and low temperatures. 

    >**NOTE:** The WebSocket temperature records should be added to the div with the id `#ws-chart-container`.

### TODO 2: Update Records Functions
We will need to create functions to update the high and low temperature records we are recording. The simplest way to do this is to create one function for regular polling records and one function for WebSocket polling records.

<hr>

* **2a)** Create a function called `updateRegRecords`. Below is a description of the function:

    >**CODE:** 
    >* **Name:** `updateRegRecords`
    >* **Parameters:** `value`: the current temperature read from the device
    >* **Description:**  `updateRegRecords` should update the high and low records of your elements with ids of `"reg-highest"` and `"reg-lowest"`. You will need to check if the current `value` is higher than the current `regHighest` variable **OR** lower than the current `regLowest` variable. If either (or both) of these are true, then you need to do the following:
    >    1. Update the `regHighest` and/or `regLowest` variables to store the new `value`.
    >    2. Update the appropriate jQuery element(s) to display the the new `regHighest` and/or `regLowest` temperature values.

    <br>

    >**HINT:** Recall that jQuery is able to update displayed text. For instance, if you were to write `$("#reg-highest").text("Highest recorded value is " + 72);` then your element displaying the highest recorded regular polling temperature would now display `"Highest recorded value is 72"`. 

<hr>

* **2b)** Create a function called `updateWSRecords`. Below is a description of the function:

    >**CODE:** 
    >* **Name:** `updateWSRecords`
    >* **Parameters:** `value`: the current temperature read from the device
    >* **Description:**  `updateWSRecords` should update the high and low records of your elements with ids of `"ws-highest"` and `"ws-lowest"`. You will need to check if the current `value` is higher than the current `wsHighest` variable **OR** lower than the current `wsLowest` variable. If either (or both) of these are true, then you need to do the following:
    >    1. Update the `wsHighest` and/or `wsLowest` variables to store the new `value`.
    >    2. Update the appropriate jQuery element(s) to display the the new `wsHighest` and/or `wsLowest` temperature values.

><details> <summary> CLICK FOR AN EXPLANATION OF HOW/WHY THIS TODO WORKS </summary>
>
>The purpose of TODO 2 is to keep track of the highest/lowest values yet recorded. To demonstrate how this works, let's look *only* at the case of the `regHighest` variable. We'll walk through the steps of updating the highest recorded temperature after multiple polls to the thermometer.
>
>>**Step 1:** Assume we have just started running the program. Then `regHighest` has a value of `-500`. Notice that we start at a *low* value. You will why soon.
>
>>**Step 2:** Okay, now assume that it is freezing in the room with the thermometer. The first temperature measurement recorded is only `12` degrees. When that gets passed into the `updateRegRecords` function to the parameter `value`, then `value` is now `12.
>
>>**Step 3:** Compare `value` to `regHighest`. Well, `regHighest` is currently `-500` and `value` is `12`. Because `12` is higher than `-500`, you will want to save `12` inside of the `regHighest` variable. You do so, and now `regHighest` is `12`.
>
>>**Step 4:** You poll the thermometer again. This time the new temperature is `50`. `50` is higher than `12` (the current value of `regHighest`), so once again, you will update `regHighest`. Now, `regHighest` stores the value `50` as the highest temperature yet seen.
>
>>**Step 5:** You poll the thermometer yet again. This time the new temperature is `40`. You compare `regHighest` to `40` and see that `regHighest` is higher than `40`, so you don't change it. `regHighest` is still `50`, which is the highest temperature recorded so far.
>
>In short, if you start with an initial **very low** temperature as your record high, then you guarantee that your first measurement will replace the made-up starting value immediately. After that, it's just a matter of checking if each new temperature is higher or lower than the last. Higher ones will replace the record, whereas lower ones will be ignored.
>
>Finally, handling record low values is done the exact same way, except you need to start with a **very high** temperature for the exact same reason; you want your first real measurement to guarantee that it will replace the made-up starting value.
>
></details>

### TODO 3: Regular Polling
Before we can actually update our high and low records or populate any of our data charts, we need to get data from a temperature sensor somewhere. We are going to do that in two ways, the first of which is through regular polling. The data we obtain this way will be displayed on the left side of the screen.

<hr>

* **3a)** To start, create a function called `doPoll` that will handle our regular polling. Our `doPoll` function should only call `$.getJSON(<insert callback function here>)`. You will need to provide a callback function that takes a single parameter called `result`. The skeleton for this will look like:

```js
$.getJSON("https://f3dc5044859d.ngrok.io/pi/sensors/dht/temperature", function (result) {});
```

>**IMPORTANT NOTE:** The jumble of letters that is `f3dc5044859d` will almost certainly need to be changed. Please ask your instructor for the correct URL.

>**ANOTHER IMPORTANT NOTE:** Note that there is the "/pi/sensors/dht/temperature" after the "ngrok.io" part of the URL. Without that, you won't access the temperature values.

<hr>

* **3b)** You must program the body of your callback function. The body should perform three tasks. 

    1. The first is to execute the following function call:

        ```js
        addDataPoint(result, regData, regChart);
        ```

        This function call adds the current temperature reading to the list of data points on display in the regular polling temperature chart. 

    2. After the `addDataPoint` call, you need to call your `updateRegRecords()` function while passing in the argument `result.value`. `result` is not actually a simple temperature value, but an object holding the temperature value. Thus, you need to access the `value` property in order to pull out the actual temperature being measured.

    3. Finally, you need to add the line `setTimeout(doPoll, 10000);`. This will make sure that `doPoll` is called every 10 seconds. If you would rather a different interval, feel free to change it, but don't set the interval to anything smaller than `1000`.

<hr>

* **3c)** Once you've completed your `doPoll` function, you need to actually call the function. You can do that by putting a function call for `doPoll` right after its definition.
    
>**TESTING:** Once all of this is done, open your `polling-temp-charts.html` web page. You should see the left chart on your page updating every 10 seconds and the high and low temperatures now displaying more sensible numbers.

### TODO 4: WebSockets Polling
The second way we are going to obtain temperature data is through WebSocket polling. 

<hr>

* **4a)** You will be storing the WebSocket connection in a variable called `socket`. The first thing we need to do is create a new WebSocket connection as follows:

    ```js
    var socket = new WebSocket('ws://f3dc5044859d.ngrok.io/pi/sensors/dht/temperature');
    ```

    You will also want to copy the following code and paste it below the new socket instantiation.

    ```js
    socket.onmessage = function (event) {
        // Fill in the body of the onmessage function
    };

    socket.onerror = function (error) {
        // Fill in the body of the onerror function
    };
    ```

>**IMPORTANT NOTE:** The jumble of letters that is `f3dc5044859d` will likely need to be changed due to how ngrok works. Please ask your instructor for the correct URL.

<hr>

* **4b)** The second step to creating the WebSocket connection is to define what we should do when we receive an update from the device we have connected to. To do so we must fill in the body of the function `socket.onmessage`. This function takes in a parameter called `event`. The `event` is an object that can be parsed using `JSON.parse()`, so to get the temperature measurement we must pull that out of our event data using the following line to our function body:

    ```js
    var result = JSON.parse(event.data);
    ```

<hr>

* **4c)** Next, we must add the data point to the WebSocket chart, which is done similarly to how we added the data point in the regular polling section. We add the line:

    ```js
    addDataPoint(result, wsData, wsChart);
    ```

<hr>

* **4d)** The last thing we need to add to our `socket.onmessage` function is a call to update the record highs and lows of the WebSocket connection. This is where you will call your `updateWSRecords()` function. Remember to pass it the `value` property of the result and not the result object itself!

<hr>

* **4e)** Finally, you need to add a function body to the `socket.onerror` function. For this, all you need to do is write the error to the console, and you're done!

### Bonus
Can you rewrite your code to use only a single `updateRecords` function rather than `updateRecRecords` and `updateWSRecords`? 

>**Hint:** A working `updateRecords` function will require two arguments instead of one (unless you do some fancy data manipulation first).

>**TESTING:** Once all of this is done, open your `polling-temp-charts.html` web page. You should see the right chart on your page update eventually and the high and low temperatures now displaying more sensible numbers. Because it will only update if the temperature changes, it might take a moment before anything displays, however.

<hr>

## Actuator Form Web Page
The next web page that you need to create is the actuator form web page. This is a web page that will allow you to send text to a display unit at a remote location. You can then click on a link that will show you a camera display of the sensor (the camera link will not update in real time, so if you don't see your message displayed wait a few seconds and hard refresh the page).

### TODO 5: Actuator AJAX POST
There's really only one thing that needs to be done for this web page, and that's put in an AJAX call to send the necessary POST to the actuator. The skeleton of an AJAX call looks like this:

```js
$.ajax({ });
```

* **5a)** Put the above code into your actuator form web page at the appropriate location.

Of course, that won't do much on its own. What you'll need to do is fill in the properties of the currently empty object being passed into the AJAX call. 

* **5b)** Put in the first five properties into the empty object of your AJAX call. These properties should be as follows:

    ```js
    url: 'http://devices.webofthings.io/pi/actuators/display/content/',
    dataType: 'text',
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded',
    data: $(this).serialize(),
    ```

>**READ:** These properties serve the following purposes:
>
>* url: where to send the request to
>* dataType: the type of data being returned
>* method: the type of request being sent (in this case a post, meaning we're also sending information to the server)
>* contentType: the format of the data we are sending to the server (in this case the display actuator)
>* data: the actual data we are sending; `$(this).serialize()` transforms the text we have in our input box into the "x-www-form-urlencoded" data type

You aren't quite done yet, however. There are still two more important properties that need to be added. These are the `success` and `error` properties, and both of them should have functions as their values. The `success` property should be a function that takes the data returned from your AJAX request onto your web page. The `error` property should be a function that writes any errors that occur to the console.

* **5c)** Give the `success` function the following value:

    ```js
    function( data, textStatus, jQxhr ){
        $('#response pre').html( data ); 
    }
    ```

* **5d)** Give the `error` function the following value:

    ```js
    function( jqXhr, textStatus, errorThrown ){
        console.log( errorThrown ); 
    }
    ```

>**TESTING:** Once all of this is done, open your `actuator-form.html` web page. If you click on the "Submit" button, then you should see a line of text pop up above the button detailing information about the AJAX message sent and response received. If you see that, then the page works!

<hr>

## Device Parser Web Page
The final web page that needs to be created is the device parser web page. This will request information regarding a specific device and then display it upon receiving the response.

### TODO 6: Device Parser AJAX GET
The first TODO of this page is to make an AJAX call, just as we did with the actuator form page. This time, however, we are going to be making a GET request instead of a POST. 

* **6a)** Add the following properties into the object being passed to this AJAX call:

    ```js
    url: $('#host').val(),
    method: 'GET',
    dataType: 'json',
    error: function (jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
    },
    ```

### TODO 7: Generate Sensors URL
This step is simple, but you must do it *below* the comment labeling TODO 7 and *above* the following AJAX call. 

* **7a)** Create a new variable called `sensorsPath` and assign it the concatenated value of `data.url` and `data.resources.sensors.url`. `data.url` is the URL of the device we are querying, and `data.resources.sensors.url` is the relative path down to the sensors from the root of that device.

>**TESTING:** Once all of this is done, open your `device-parser.html` web page. If you click on the "Browse this device" button, then you should information appearing in both the "Metadata" and "Documentation" sections of your page.

### TODO 8: Device Parser AJAX Success
The final step is a big one, as there are four parts to it. The goal here is to use the list of sensors (found in the parameter `data`) returned from the successful inner AJAX call to produce a list of links on your web page. The approach to this is going to be to create a string that contains the HTML code that would generate such a list. 

<hr>

* **8a)** Create a new string variable (call it `sensorsList`) and initialize it to an empty string.

<hr>

* **8b)** Announce how many sensors were found. The parameter `data` contains a list of all sensors (in object form), so you can do that with the following line of code:
    
    ```js
    $('#sensors').html(Object.keys(data).length + " sensors found!");
    ```

    That line tells the `<div>` with `id = "sensors"` that it should contain a string listing the number of keys found in the data returned from our AJAX query (which is the number of sensors that exist!).

<hr>

* **8c)** Iterate over the list of sensors returned. 

    >**READ:** Because `data` is JSON format, you can iterate over it as you would any other object. This iteration should build up the `sensorsList` string initialized earlier, and it should ultimately consist of a series of text blocks of HTML code containing `<li>` elements with `<a>` elements inside. As an example, if we had a sensor in our `data` object with the key of `"temp"`, we could generate that block of HTML code with the following line:
    >
    >```js
    >var html = "<li><a href=\"" + sensorsPath + "temp" + "\">" + data["temp"].name + "</a></li>";
    >```

    >>**IMPORTANT:** The above code is an example of constructing a *single* line of HTML code. To construct all of the HTML to cover all sensors, you'll need to generalize that line of code (to work with a **for-in** loop) and use it to build up your `sensorsList` string. You can do this by adding to the `sensorsList` with each iteration (i.e. `sensorsList = sensorsList + ???`), where "???" should be the new line of HTML built for each sensor.

><details> <summary> CLICK FOR for-in loops REVIEW </summary>
>Here is an example of using a for-in loop to print all keys and values from an object.
>
>```js
>let car = {
>    color: "blue",
>    year: 1995
>};
>
>for (var key in car){
>    console.log("The key " + key + " has a value of " + car[key]);
>}
>```
>
>This would print one line per key to the console, listing all keys and all values associated with said keys. The output would look like the following:
>
>```js
>"The key color has a value of blue"
>"The key year has a value of 1995"
>```
>
></details>

<hr>

* **8d)** The final step is to use jQuery to display the list of sensors that you should have just created. That can be done with the following line of code:

    ```js
    $('#sensors-list').html(sensorsList);
    ```

>**TESTING:** Once all of this is done, open your `device-parser.html` web page. If you click on the "Browse this device" button, then you should see the number of sensors being displayed, as well as a list of sensors below that number. If everything shows up, then you are done! 