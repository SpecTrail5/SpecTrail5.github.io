# pi-inyourface
Add in interface support to your Pi server

**Table of Contents**
 
- [Setup](#setup)
- [Important Information](#important-information)
- [Lesson Steps](#lesson-steps)
    - [TODO 1: LEDs Plugin](#todo-1-leds-plugin)
    - [TODO 2: Update Routes](#todo-2-update-routes)
    - [TODO 3: Add WebSockets Server](#todo-3-add-websockets-server)
    - [TODO 4: Test Web Page](#todo-4-test-web-page)

## Setup
* This project should be completed on your Pi. **DO NOT WORK ON THIS PROJECT UNTIL SECOND SLICE OF PI IS COMPLETED**
* Open a new terminal on your Pi (putty or otherwise)
* Enter the command `cd <your GitHub repository's name>` to enter your repository directory
* Enter the command `cd iot-projects` to enter your iot-projects directory
* Enter the command `cp -r second-slice-of-pi/* pi-inyourface/.` to copy your completed second-slice-of-pi's work into pi-inyourface's directory
* Enter the command `cd pi-inyourface` to enter the new project's directory
* Run the command `npm install websocket ws lodash onoff node-dht-sensor express cors epoll body-parser xmlhttprequest node-json2html`
* Run the command `git add -A`
* Run the command `git commit -m "set up pi in your face"`
* Run the command `git push`

## Push Reminder
To push to GitHub, enter the following commands in bash:
```
git add -A
git commit -m "saving first slice of Pi"
git push
```

## Important Information
You must keep your working code on your Pi. However, you can edit your code on any machine, and then use GitHub (or other methods) to move your changes to your Pi for testing.

**To test your code,** you will need to follow the following steps (for all TODOs except TODO 4).
1. Make certain that your terminal (on your Pi) is in your project directory. `cd` into it if you are not.
2. Run the command `node wot-server.js`
3. Open a second terminal
4. Use `curl` commands to send requests to your running server

**IMPORTANT NOTE:** If a `curl` command crashes your server, you will need to restart it in the first terminal before sending another `curl` request.

## Lesson Steps
This project is the third part of the multi-project undertaking that is setting up a server to allow others to interface with your Pi. For your server itself, you will be adding in two things: a plugin for communicating with the LEDs, and WebSocket support. You will also update a few other parts of your server to support these new additions.

Once your server has been updated, you will need to create a test web page for WebSocket support. This will consist of connecting multiple WebSocket clients to your server to listen for updates.

### TODO 1: LEDs Plugin
Deep in the file **`plugins/internal/ledsPlugin.js`**, you will find that you have already been given the `start()` function for your plugin. You will also see that the `start()` function calls `connectHardware()`, which has not been provided.

Your goal here is to create the `connectHardware()` function, as well as to export a `stop()` and a `switchOnOff` object. The connectHardware is the simplest, so let's handle that first.

* **1a)** Create the following function:
    * **Name:** `connectHardware`
    * **Parameters:** None
    * **Returns:** Nothing
    * **Description:** This function should do the following:
        1. Import the `'onoff'` library (although you could import this globally if you prefer, like you do in **`pirPlugin.js`**). 
        2. Call the Gpio's `watch` method, with the callback function defined to accept an error and value parameter (see slides or the [Hardware Tests](https://github.com/OperationSpark/hardware-tests/blob/master/tests/pir.js) project if you need a reminder on how to do this)
        3. Create a new Gpio connection in `'out'` mode for each LED (two total), and assign each connection to `actuator1` and `actuator2` (both variables already created globally), respectively. 
            
    >**Hint 1:** The `model` variable stores both LEDs, but you must use bracket notation to access them. For instance, to get the `gpio` value from the first LED, you would write `model[1].gpio`.

    >**Hint 2:** Creating a new Gpio connection in `'out'` mode is exactly the same as you would do for `in` mode, except you don't need to pass in a third parameter for `'out'` mode (i.e. no `'both'` like you do in your `pirPlugin.js` file)

* **1b)** Create the following function:
    * **Name:** `stop`
    * **Parameters:** None
    * **Returns:** Nothing
    * **Descriptions:** This function should do the following:
        1. Turn off each LED. This can be done via `LEDGpioConnection.write(0)` for each Gpio connection.
        2. Disconnect from the LEDs using the `unexport()` method, similar to how you do with the pirPlugin's `stop()` method. 

* **1c)** Create the `switchOnOff` object
The `switchOnOff` object is what you will use to turn your LEDs on and off. To do so, you will create a method associated with each LED's number. This will take on a structure similar to:

    ```js
    exports.switchOnOff = {
        1: function (value) {
            // turn LED 1 on or off based on value
        },
        2: function (value) {
            // turn LED 2 on or off based on value
        }
    }
    ```

    To actually turn on/off the LED, you will need to use the `.write()` function (like you did in `stop()`). A `1` means to turn the LED on and a `0` means to turn it off. 

    >**WARNING:** The `value` you receive as an argument to your functions may be a Boolean, so you will have to use either explicit conditionals (`if`/`else`) or the ternary conditional (`<condition> ? <true response> : <false response>`) to handle this.

    >**IMPORTANT NOTE:** Be extra careful during this TODO, as you will not be able to test your code until TODO 2 is completed.

### TODO 2: Update Routes

* **2a)** `actuators.js`
    The only routes you will need to update are the actuator routes. First, be sure to import the plugin you just created at the top of the file using `ledsPlugin = require('./../plugins/internal/ledsPlugin');`.


    Now, the only route you will need to update is the `'/leds/:id'` route. Because you want to be able to send signals to the LED, you will need to add PUT support. You can do this by appending `.put(function(req, res, next){})` to the current route command. In short, your route should look similar to this:

    ```js
    router.route('/leds/:id').get(...).put(...);
    ```

    The callback function for the `.put()` method should update the specified LED's value. You should know from the `.get()` method how to reach the LED's representation in the resources object. You can update it by assigning its `value` property the value passed in through the request body (i.e. `req.body.value`);

    Once you've updated the LED's value, you need to set `req.result` to have the value of the specified LED.

    Next, call `ledsPlugin.switchOnOff[req.params.id](req.body.value);`. This will call the correct version of the switchOnOff method you created in your ledsPlugin, while passing in the value you want to set your LEDs state to (i.e., on or off).

    Finally, call `next()` to finish updating your routes.

<hr>

* **2b)** `wot-server.js`
Once you've updated your routes, you'll need to update the wot-server to handle startup and shutdown of your new ledsPlugin. Complete the following steps to do so.

    1. Import the plugin using `require` (the same plugin that you imported in `actuators.js` up in **2a**).
    2. Call the `start` method for your ledsPlugin.
    3. Call the `stop` method for your plugin.

    <br>

    Each of these steps should be done where the corresponding steps are for the other plugins that you are using.

    At this point, you will be ready to test your server using CURL to send PUT messages to your device. If all go well, you will be able to turn on and off your LEDs at will!

<hr>

**TEST YOUR CODE**

To test your code, you will need to run commands in the bash terminal *after* starting up your wot-server. All of the commands will have the following format:

```
curl -X PUT -H "Content-Type:application/json" -d '{"value": <true or false>}' url.to.led
```

For your actual commands, your value must be either `true` or `false` and `url.to.led` is the actual url to your led (use `localhost:port-number/pi/...`)

For example, IP address aside, this should turn on one of your leds

```
curl -X PUT -H "Content-Type:application/json" -d '{"value": true}' http://192.168.1.250:8484/pi/actuators/leds/1
```

**Run the following four tests to make certain that your code works.**

1. A curl command that turns *on* LED 1
2. A curl command that turns *on* LED 2
3. A curl command that turns *off* LED 1
4. A curl command that turns *off* LED 2

### TODO 3: Add WebSockets Server
So far, you've added in all the support you need to allow communication with your devices, be that sending commands are requesting information. Now, it's time to add in support for real-time updates from your server, so that clients can subscribe to your devices and monitor their conditions.

In `servers/websockets.js`, you will find much of the code you need to execute the WebSocket server already provided. Your job is to construct the body of the `wss.on()` method's callback function.

* **3a)** Get the specific URL the client wants to subscribe to by copying it from `req.url`.

* **3b)** Find the resource that matches that URL. The provided function `selectResource(url)` returns a resource if it is given a valid URL, and `undefined` if the URL is invalid. **Store the result of `selectResource` in a variable for later.**

* **3c)** If the URL was invalid, print an error warning to the console and exit from the function (use `return` and give no value to the `return`).

* **3d)** Use the provided `utils.monitor()` function to watch the specified resource for the client. `utils.monitor()` takes three arguments. The first is the resource location, which you should have obtained from `selectResource()`; the second is the refreshRate (defined at the beginning of the file); the third is a callback function.

    The callback function takes one parameter called `changes`. The body of the callback function should simply be

    ```js
    ws.send(JSON.stringify(changes));
    ```

    which will send back to the client a list of all changes that occurred to the resource since the last time it was checked.

* **3e)** Update `wot-server.js` once again. This time, start by importing the websockets server (located at `"./servers/websockets"`).

    Finally, place the line

    ```js
    <websocketServer-variable-name>.listen(server);
    ```

    inside of the callback function for `httpServer.listen()`.

>**IMPORTANT NOTE:** This is another TODO that you will not be able to test immediately, so make sure you are mindful of your changes so that you will know where to go back and look if TODO 4's tests fail.

### TODO 4: Test Web Page
Most of the test web page has been provided for you in the file **`ws_client.html`**. However, you need to construct the body of the `connect` function that will create WebSocket clients to connect to your server.

* **4a)** Inside of your `connect()` function, create a new WebSocket client with the line

    ```js
    var socket = new WebSocket(url);
    ```

* **4b)** Create a `socket.onopen` method as follows:

    ```js
    socket.onopen = function (event) {
        console.log("OPENED CONNECTION");
        $(updateElement).html("<h4>Awaiting update<h4>");
    }
    ```

* **4c)** Create a `socket.onmessage` method. This will be just like the `onopen` method. However, you can now use the provided `event` to obtain the data you need to display via `let result = JSON.parse(event.data);`. This method should update your HTML to display the received information, which will be stored in `result.value`.

* **4d)** Create a `socket.onerror` method in exactly the same way as you created the `onopen` method, but update the messages displayed to show that an error has occurred (also, the incoming parameter should be called `error` for this method, not `event`).

* **4e)** Make sure that all of the URLs in your test web page are correct (lines 60-62 by default), and then test your server/client pair!

**TEST YOUR CODE**

To test your code, make sure that you restart your wot-server, then open up `ws_client.html` using live server (or directly in the browser). If it works, then you will see the values of your sensors displaying on the web page.
