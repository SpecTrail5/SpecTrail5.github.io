# first-slice-of-pi
set up routes for a server that handles multiple devices attached to a Pi

**Table of Contents**
 
- [Setup](#setup)
- [Important Information](#important-information)
- [Lesson Steps](#lesson-steps)
    - [TODO 1: Study the File Structure](#todo-1-study-the-file-structure)
    - [TODO 2: Initial HTTP Server Setup](#todo-2-initial-http-server-setup)
    - [TODO 3: Sensor Routes](#todo-3-sensor-routes)
    - [TODO 4: Actuator Routes](#todo-4-actuator-routes)
    - [TODO 5: PIR Plugin](#todo-5-pir-plugin)
    - [TODO 6: DHT Plugin](#todo-6-dht-plugin)

## Setup
* This project should be completed on your Pi.
* Open a new terminal on your Pi (putty or otherwise)
* Enter the command `cd <your GitHub repository's name>` to enter your repository directory
* Enter the command `cd iot-projects/first-slice-of-pi` to enter this project's directory
* Run the command `npm install onoff node-dht-sensor express cors epoll` to install the libraries we will be using during this project

## Push Reminder
To push to GitHub, enter the following commands in bash:
```
git add -A
git commit -m "saving first slice of Pi"
git push
```

## Lesson Steps
This project is the first of several that will work together to bake a fully-fledged Raspberry Pi system. There will be a lot of pieces all working together, so while you're working, do your best to keep track of how everything interconnects. It might seem daunting at first, with a total of eight files and several folders organizing those files, but learning how each piece relates to one another now will make the next few projects much simpler.

## Important Information
You must keep your working code on your Pi. However, you can edit your code on any machine, and then use GitHub (or other methods) to move your changes to your Pi for testing.

**To test your code (AFTER completing TODO 2 and on),** you will need to follow the following steps.
1. Make certain that your terminal (on your Pi) is in your project directory. `cd` into it if you are not.
2. Run the command `node wot-server.js`
3. Open your browser and go to your Pi's URL. Then you will need to enter `<your Pi's IP address>:8484` into the URL bar (`192.168.1.249:8484`, for example). 

>**IMPORTANT NOTE:** If you are using the browser that runs on your actual Pi, then you can substitute `<your Pi's IP address>` with `localhost` instead.

### TODO 1: Study the File Structure
As mentioned, there are eight files that all work together. Skeletons for all of these files (and in some cases the entire file) have already been provided for you. Before you begin working in them, study how each of these files connects to one another so that you are familiar with the layout and dependencies between files. Below is a brief summary. 

* The **`resources`** directory contains two files. 
    * **`resources.json`** is a JSON file that represents your device. Assuming you have your Pi and its connected hardware set up the way that the [Hardware Tests](https://github.com/OperationSpark/hardware-tests) project instructed, this file is accurate and should not be changed. 
    * **`model.js`** serves to export the resources.json file for use by all other files.

* The **`plugins`** directory contains the **`internal`** directory, which in turn contains two files. These files are what manage the behavior of your sensors (and later LEDs). 
    * The **`dhtPlugin.js`** file holds the code for the plugin that manages your DHT sensor. 
    * The **`pirPlugin.js`** file holds the code for the plugin that manages you PIR sensor.

* The **`routes`** directory contains files that handle routing to your sensors, actuators, and intermediate routes. 
    * The **`actuators.js`** file manages access to your actuators.
    * **`sensors.js`** manages access to your sensors.

* The **`servers`** directory only contains the **`http.js`** file. This file pulls all of your routes together (plus a few of its own) and sets up your express server.

* Lastly, the **`wot-server.js`** file is where you start your plugins and servers. This is also the file that you should run using the command `node wot-server.js` if you want to test your code. Keep in mind that this will only work properly if you are testing it on your Pi.

* **1a)** To complete this TODO, write a comment on the last line of the **`http.js`** file that says `// I have looked through all files`

### TODO 2: Initial HTTP Server Setup
This TODO will take place within the **`servers/http.js`** file. When you first open the file, all you will see are the lines to import the necessary libraries and an export line. 

Right now, there are only four Tasks you need to do in this file. 

* **2a)** Initialize the express server immediately after importing it by using the line `var app = express();`
* **2b)** Tell your server to use CORS with `app.use(cors());`
* **2c)** Tell the server how to handle GET requests to the root of your device. Make certain it provides an appropriate message.
    >**Advice**: take a look at the following code:
    >```js
    >app.get('/', function(req, res){
    >    res.send('Some response for accessing the root');
    >});
    >```
    >
    >This code will tell the server how to respond to requests to the root location of `'/'` (your Pi's IP address), which is by sending back a response of `'Some response for accessing the root'`. Essentially, any time someone pings the "home page" of your Pi's URL, this is the response they will get.

* **2d)** Tell the server how to handle GET requests to the gateway to your device. **Make certain that you send a different response than you did in the root.**
    >**Advice**: you should basically do the same thing as you did for **2c**, except this time you want to handle requests to `'/pi'`, which is the top level gateway to your device. In other words, if someone pings the URL of `<your Pi's IP address>:8484/pi`, then whatever you `send` back in response is what they will receive back. 

<hr>

>**TEST YOUR CODE**
>
>To test your code at this point, follow the steps listed at the top of these instructions in the **Important Information** section. Then, do the following.
>
>1. Open your browser at `'<your Pi's IP address>:8484/`. If you see the text response for the root `/`, then everything up through **2c** is correct!
>2. Open your browser at `'<your Pi's IP address>:8484/pi`. If you see the text response for the gateway `/pi`, then **2d** is correct as well!

>**DO NOT PROCEED UNLESS BOTH TESTS PASS**
<hr>

### TODO 3: Sensor Routes
Most of this TODO takes place in the **`routes/sensors.js`** file, though at the end you will also need to update the `http.js` file, so be sure to keep that open.

* **3a)** Set Up Routes 
    The `sensors.js` file already imports everything you will need, and also exports the constructed router. Your job will be to establish all of the possible sensor routes, of which there are five.

    >**READ:** The first route is the sensors root, or `'/'`. **This is not to be confused with the `'/'` route in the `http.js` file.** Because of how we will update the `http.js` file at the end of this TODO, the path to the sensors root is inherent to any of the defined sensor routes, meaning that `'/'` actually refers to `'<your Pi's IP address>:8484/pi/sensors/'`. 

    >**CODE:** Create the five routes and have them return the data stored in the model as defined by `resources.json` and `model.js`. For example, the routes to `'/'` and `'/dht'` (meaning `'/pi/sensors/'` and `'/pi/sensors/dht'`, respectively) would be defined by:
    >
    >```js
    >router.route('/').get(function (req, res, next) {
    >    res.send(resources.pi.sensors);
    >});
    >
    >router.route('/dht').get(function (req, res, next) {
    >    res.send(resources.pi.sensors.dht);
    >});
    >```
    >
    >In addition to those two routes, you should also include routes to `'/dht/temperature'`, `'/dht/humidity'`, and `'/pir'`. That means **there should be a total of five routes in this file when you are done.**

* **3b)** Update HTTP Server
    Once you have all the routes in place, go back into the `http.js` file and add in two things. 

    * **3b-1)** At the top of the file, you need to import the routes using `var sensorRoutes = require('./../routes/sensors');`. The single `'.'` at the beginning of the string says that the program is looking for the specified file using a relative file path, and the `'..'` says that it needs to start looking in the parent directory of the current file (i.e. one level up from the servers directory).
    * **3b-2)** Just below the already existing line of `app.use(cors());`, add in the line `app.use('/pi/sensors', sensorRoutes);`. This tells the server that it should route all requests to `'<your Pi's IP>:8484/pi/sensors'` or any of its sub-destinations (e.g. `'<your Pi's IP>:8484/pi/sensors/pir'`) through the sensor routes you just defined.

<hr>

>**TEST YOUR CODE**
>
>To test your code at this point, follow the steps listed at the top of these instructions in the **Important Information** section. Then, do the following.
>
>1. Open your browser at `'<your Pi's IP address>:8484/pi/sensors`
>2. Open your browser at `'<your Pi's IP address>:8484/pi/sensors/dht`
>3. Open your browser at `'<your Pi's IP address>:8484/pi/sensors/dht/temperature`
>4. Open your browser at `'<your Pi's IP address>:8484/pi/sensors/dht/humidity`
>5. Open your browser at `'<your Pi's IP address>:8484/pi/sensors/pir`
>
>All of the above URLs should display an object. If you see either a blank page or an error, then it means that the corresponding route was not configure correctly and you should double check what you have written in your code.

**DO NOT PROCEED UNLESS ALL TESTS PASS**
<hr>

### TODO 4: Actuator Routes
Most of this TODO takes place in the **`routes/actuators.js`** file, though at the end you will also need to update the `http.js` file, so be sure to keep that open. You are essentially doing the same thing that you did with the sensors, but there is one part that can/should be handled differently.

<hr>

* **4a)** Set Up Routes

    The `actuators.js` file has the same initial setup as the `sensors.js` file. Setting up the routes here is similar, as well. 

    This time, there are four routes you need to set up: the root `'/'` (corresponding to `resources.pi.actuators`), `'/leds'`, `'/leds/1'`, and `'/leds/2'`. Both `'/'` and `'/leds'` can be set up the normal way, but there is a way to combine `'/leds/1'` and `'/leds/2'` into a single route, which is especially useful if you plan on adding more LEDs to your device later.

* **4a-1)** Set up the `'/'` and `'/leds'` routes the same way you set up all of the *sensors* routes.

* **4a-2)** Once you've put in the routes for `'/'` and `'/leds'`, you can handle the `'/leds/1'` and `'/leds/2'` routes using the following code:

    ```js
    router.route('/leds/:id').get(function (req, res, next) {
        res.send(resources.pi.actuators.leds[req.params.id]);
    });
    ```

    >**READ:** The ":id" of the URL registered with the router lets you put any number into that part of the URL. You can then retrieve that number in your `.get` function using `req.params.id`. This lets you register a single route for all of your leds, since the leds are only differentiated by their number.

<hr>

* **4b)** Update HTTP Server
Once you have all the routes in place, then back in the `http.js` file, you once again need to add in two things. 

* **4b-1)** Import the routes using `var actuatorRoutes = require('./../routes/actuators');`. 
* **4b-2)** Tell the server to route all requests to `'/pi/actuators'` and sub-destinations through your actuator router (like how you used `app.use('/pi/sensors', sensorRoutes);` for the sensor routes).

<hr>

>**TEST YOUR CODE**
>
>To test your code at this point, follow the steps listed at the top of these instructions in the **Important Information** section. Then, do the following.
>
>1. Open your browser at `'<your Pi's IP address>:8484/pi/actuators`
>2. Open your browser at `'<your Pi's IP address>:8484/pi/actuators/leds`
>3. Open your browser at `'<your Pi's IP address>:8484/pi/actuators/leds/1`
>4. Open your browser at `'<your Pi's IP address>:8484/pi/actuators/leds/2`
>
>All of the above URLs should display a condensed object. If you see either a blank page or an error, then it means that the corresponding route was not configure correctly and you should double check what you have written in your code.

**DO NOT PROCEED UNLESS ALL TESTS PASS**

### TODO 5: PIR Plugin
Currently, you have your server set up to send responses to any GET request your Pi receives, but the data it sends back will not be current. That's because you never set up a connection with any of the hardware (DHT, PIR, or LEDs). We will ignore the LEDs for this project, but both the PIR and DHT sensors need to be handled now. Let's start with the PIR.

In the **`plugins/internal/pirPlugin.js`** file, you will see that the resource model has already been imported and some basic variables defined. One important variable is the `device` variable, which comes from the imported resource model. This contains all of the information about the PIR sensor, and it can be updated using this plugin.

Also: note that the `onoff` library has been imported, which you will use to connect to and manage interactions with the PIR sensor. 

Your goal will be to create three functions, then update **`wot-server.js`** to make use of the plugin once it's ready. 

<hr>

* **5a)** Create the following function:
    * **Name:** `connectHardware`
    * **Parameters:** None
    * **Returns:** Nothing
    * **Description:** This function should do the following:
        1. Create a new Gpio connection with `new Gpio(device.gpio, 'in', 'both')`, and save the connection in the `sensor` variable (it should not make a new `sensor` variable, as this variable already exists in the global scope).
        2. Call the Gpio's `watch` method, with the callback function defined to accept an error and value parameter (see slides or the [Hardware Tests](https://github.com/OperationSpark/hardware-tests/blob/master/tests/pir.js) project if you need a reminder on how to do this)
        3. When calling the `watch` method, define the callback function to do the following:
            >Check if there are errors by checking the truthiness of the `err` parameter. If there is not an error, then update the model's value using `device.value = !!value` (this converts the `0` or `1` that value would normally be to `false` or `true`, respectively).

<hr>

* **5b)** Create the following function:
    * **Name:** `start`
    * **Parameters:** None
    * **Returns:** Nothing
    * **Description:** This function should call `connectHardware()` and do nothing else.

    >**IMPORTANT:** After creating this function, put the line `exports.start = start;` at the end of your program. This **exports** the function, which means other files can use the function if they `require` it.

<hr>

* **5c)** Create the following function:
    * **Name:** `stop`
    * **Parameters:** None
    * **Returns:** Nothing
    * **Description:** This function should call `sensor.unexport()` and do nothing else.

    >**IMPORTANT:** After creating this function, put the line `exports.stop = stop;` at the end of your program.

<hr>

* **5d)** Update wot-server.js
    In `wot-server.js`, import the PIR plugin with the line 

    ```js
    var pirPlugin = require('./plugins/internal/pirPlugin');
    ```

    Next, start the plugin with the command `pirPlugin.start({});`. **Make sure that you start the plugin *before* you start the server!**

    >**NOTE:** We give an empty object as an argument to `pirPlugin.start()`. That would be used by the `params` parameter in the start function if you made use of it. You don't have to here, but if you wanted to customize the sensor's behavior, you would do so by putting in customization data into that object.

    Finally, in `process.on()`'s callback function, add the line

    ```js
    pirPlugin.stop();
    ```

    to just before the call to `process.exit()`.

<hr>

>**TEST YOUR CODE**
>
>To test your code at this point, follow the steps listed at the top of these instructions in the **Important Information** section. Then, do the following.
>
>1. Open your browser at `'<your Pi's IP address>:8484/pi/sensors/pir`
>2. Mess with the PIR sensor. Assuming it is hooked up correctly, it should register your movements.
>3. Refresh your page. You should see that the value of `'value'` in the displayed data is set to `false`. If it does not, try refreshing your page a few more times.

**DO NOT PROCEED UNLESS YOU SEE `value` SET TO FALSE**

### TODO 6: DHT Plugin
The last thing you need to do is set up your DHT sensor plugin and update the wot-server to use that plugin as well. Do so in the **`plugins/internal/dhtPlugin.js`** file. The process is similar to handling the PIR plugin. Notice that once again there is a `device` variable that grabs the resource model for the DHT sensor. You will use this variable to help interface with the device. Also note the `localParams` and `interval` variables, which you will be using as well.

<hr>

* **6a)** The `connectHardware` function

    * **6a-1)** Create the following function:
        * **Name:** `connectHardware`
        * **Parameters:** None
        * **Returns:** Nothing
        * **Description:** This function should do the following:
            1. Assign an object to the `sensor` variable (which already exists in the global scope). The object should contain two properties, the keys of which should be `initialize` and `read`. Both keys should have a function as their corresponding values.

            In short, your object should look like:

            ```js
            {
                initialize: function(){
                    // initialize function body
                },
                read: function(){
                    // read function body
                }
            }
            ```



    * **6a-2)** Create the body of the `initialize` function. This function should call`sensorDriver.initialize(device.model, device.gpio)`, which sets up the connection with your DHT sensor

    * **6a-3)** Create the body of the `read` function. This function should update the device model with the current sensor values, as described in the **"READ FUNCTION WALKTHROUGH"**

    ><details> <summary>READ FUNCTION WALKTHROUGH</summary>
    >
    >To update the model, first you must save the result of reading the sensor values. The function `sensorDriver.read` returns an object with this data in it. To obtain that data, merely call the `sensorDriver.read` function (no arguments) and store the result in a new variable (name the variable whatever you wish, but be ready to use it again).
    >
    >Next, use the data obtained from `sensorDriver.read` to update your model. For example, if you saved the data object in a variable called `readout`, you could update the temperature value using the line
    >
    >```js
    >device.temperature.value = parseFloat(readout.temperature);
    >```
    >
    >Finally, make sure that you update both the temperature and the humidity values. To get the humidity value, simply replace the word "temperature" with "humidity" everwhere it occurs in the line of code above.
    >
    ></details>

    * **6a-4)** Right after the object definition, **call both `sensor.initialize()` and `sensor.read()`** to start the DHT running and read the initial values, respectively. 

        Finally, set up an interval that will regularly call `sensor.read()` by adding the following code:

        ```js
            interval = setInterval(function () {
                sensor.read();
            }, localParams.frequency);
        ```

<hr>

* **6b)** Create the following function to be exported
    * **Name:** `start`
    * **Parameters:** `params` (expects an object)
    * **Returns:** Nothing
    * **Description:** This function should do the following:
        1. On the first line, put `localParams = params ? params : localParams;` to use the passed in parameters
        2. Next, call `connectHardware`

    >**IMPORTANT: If you don't recall how to export a function, refer to TODO 5b**

<hr>

* **6c)** Create the following function to be exported
    * **Name:** `stop`
    * **Parameters:** None
    * **Returns:** Nothing
    * **Description:** This function should call `clearInterval(interval)`, and do nothing else.

<hr>

* **6d)** Update wot-server.js

    In `wot-server.js`, import the DHT plugin.

    Then, start the plugin with the command `dhtPlugin.start({'frequency': 2000});`, though feel free to change the number if you want the sensor to give updates more or less often than every 2000 milliseconds. 

    Finally, in the `process.on()`'s callback function, add the line

    ```js
    dhtPlugin.stop();
    ```

    to just before the call to `process.exit()`.

    That's it! You've set up a server that provides an interface to multiple devices on your Pi!

<hr>

>**TEST YOUR CODE**
>
>To test your code at this point, follow the steps listed at the top of these instructions in the **Important Information** section. Then, do the following.
>
>1. Open your browser at `'<your Pi's IP address>:8484/pi/sensors/dht/temperature`
>2. Look at the value of `value` in the displayed data. If the value is `0`, then refresh your page. Assuming that your DHT sensor is hooked up correctly, the value should change to a non-zero value.
>3. Open your browser at `'<your Pi's IP address>:8484/pi/sensors/dht/humidity`
>4. Look at the value of `value` in the displayed data. If the value is `0`, then refresh your page. Assuming that your DHT sensor is hooked up correctly, the value should change to a non-zero value.
>
>If you see both the temperature and humidity values changing to a non-zero value, then everything is good and you are done with this project. Don't forget to push it to GitHub!
