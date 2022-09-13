# hardware-tests
PROJECT: Put together your Pi's hardware and some small programs to test it

**Table of Contents**
 
- [Setup](#setup)
- [Lesson Steps](#lesson-steps)
    - [The Breadboard](#the-breadboard)
        - [Breadboard TODO 1: Connect Wires](#breadboard-todo-1-connect-wires)
    - [The PIR Sensor](#the-pir-sensor)
        - [PIR TODO 1: Hardware](#pir-todo-1-hardware)
        - [PIR TODO 2: Test the Hardware](#pir-todo-2-test-the-hardware)
    - [The DHT Sensor](#the-dht-sensor)
        - [DHT TODO 1: Hardware](#dht-todo-1-hardware)
        - [DHT TODO 2: Test the Hardware](#dht-todo-2-test-the-hardware)
    - [The LEDs](#the-leds)
        - [LED TODO 1: Hardware](#dht-todo-1--hardware)
        - [LED TODO 2: Test the Hardware](#led-todo-2-test-the-hardware)

## Setup

### GitHub Repo Setup

1. Prepare the `.gitignore` file
    * Open up your GitHub repo. If you do not have a `.gitignore` file, then create one.
    * Open the `.gitignore` file
    * Add the line `node_modules`
    * Push your repo
2. Log into your Pi through putty, terminal, or VNC Viewer. If using VNC Viewer, open a terminal directly on your Pi.
3. Enter these commands into the terminal:
    * `git clone <your GitHub repository's URL>`
    * `cd <your GitHub repository's name>`
4. Configure your GitHub repo on your Pi
    * Enter the command `git config -g user.name <your GitHub username>`
    * Enter the command `git config -g user.email <your GitHub email address>`
    * Enter the command `git config -g credential.helper store` (warning, this is a security risk, but useful for this class)
    * Edit your `README.md` file by adding a single new line to it and saving
    * Go to GitHub online and create a personal access token
        * Click on your icon on GitHub
        * Click on "Settings"
        * Click on "Developer settings"
        * Select "Personal access tokens"
        * Click "Generate new token"
        * Enter "Pi" as your Note
        * Set the expiration to be at least 6 months
        * Check all permissions boxes
        * Click "Generate token"
    * Copy the new token
    * Back in your terminal, push your repo. When it asks for your password, paste the token that you copied.
5. Verify that the setup for your repo was correct
    * Edit the `README.md` file by adding another new line to it
    * Push your repo again. If the setup is all correct, then you should not need to enter your username or password again

### npm Setup

In your terminal, enter the following commands:
* `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash`
* `nvm install 11`

### Project Setup

1. Make sure that you are in your GitHub repo folder in your terminal on your Pi. If you just finished the above setup, then you are already there. If not, use `cd` to enter the repo folder.
2. Enter the following commands:
    * `cd iot-projects/hardware-tests/tests`
    * `npm install onoff node-dht-sensor epoll`

## Push Reminder
To push to GitHub, enter the following commands in bash:
```
git add -A
git commit -m "saving hardware-tests"
git push
```

## Lesson Steps
There are four separate rounds of hardware setup involved in this project. The first round is preliminary, and sets up what is called a breadboard. The second round will attach an infrared motion detector, the third a dual temperature/humidity sensor, and the fourth a pair of LEDs. After the second, third, and fourth rounds each, you will put together a little program to test the hardware you've put together thus far. 

><h3>Important:</h3> For all programs written, they must be run on your Pi. Feel free to write them on a different machine, but you will need to copy them over to your Pi before you can test them.

<br>

>**NOTE:** For all steps, it might be helpful to refer to the below image. You might find it useful to keep a copy of open in a separate tab to avoid continually scrolling up and down for.

<img src="images/pi-gpio.png">

<br>
<hr>

>**BEFORE YOU BEGIN,** there are three important things you should keep in mind. 
>
>1. It is extremely important that you attach wires to the pins and location exactly as described. If you don't, then the setup won't work. 
>
>2. Don't stress out too much about making a mistake. The hardware won't work if you plug something into the wrong place, but it also won't break. If at first you don't succeed, just try again!
>
>3. **Please note that GPIO pin numbers don't match up with raw pin numbers.** For instance, pin number 7 is actually GPIO pin 4. This is partially because not all pins are GPIO pins and partially because the GPIO pins simply aren't in order.

<hr>

## The Breadboard
Now that you're ready to get started, your first task is to set up the breadboard. You will be using the breadboard as a partial intermediary between your sensors and the PI itself. While this is not strictly necessary since we are only using two sensors, if you later want to add more this setup will be useful.

### Breadboard TODO 1: Connect Wires

* **1a)** connect a wire from Pin 2 to one of the + rows on the breadboard
* **1b)** connect a wire from Pin 6 to one of the - rows on the breadboard

That's it! You've got the base for all of the rest of the hardware powered and ready to go.

<hr>

## The PIR Sensor
The first sensor you will be attaching is the passive infrared sensor, or PIR. Once you've connected the hardware, you will also put together a short program to test it. 

### PIR TODO 1: Hardware
The PIR sensor has three prongs. If they are facing upwards and on the edge closest to you, then **the right prong is the ground, the middle is the signal, and the left is the VDC,** which you can think of as the power.

* **1a)** connect a wire from the ground prong to the breadboard’s - row (the same row connected to the PI)
* **1b)** connect a wire from the VDC prong to the breadboard’s powered + row (again, the same row connected to the Pi)
* **1c)** connect a wire from the signal prong directly to Pin 7 on the Pi

#### PIR TODO 2: Test the hardware
You can run your program by typing `node pir.js`, assuming you are in the same directory as `pir.js`. If both the hardware and program are set up properly, (and you're running on the Pi and not your desktop) you should start seeing messages appear in your terminal.

<hr>

### The DHT Sensor
The second sensor you will be attaching is the dual humidity temperature sensor, or DHT. Specifically, we are using the DHT-22, which is important to know when you write any programs that interact with it. Just as with the PIR, once you've connected the hardware, you will create a small test program to verify the connections are all correct. 

#### DHT TODO 1: Hardware
>**IMPORTANT:** There are two types of DHT sensors you might have. Look at the two below situations to determine which set of steps you should follow. 

### If your sensor has four prongs, follow these instructions:
With the grill of the device face up and the prongs facing you, **the first prong is the VDC (power) prong, the second is the signal, the third is unused, and the fourth is the ground.**

* **1a-4prong)** Use a wire to connect the power prong to the breadboard’s + row
* **1b-4prong)** Use a wire to connect the ground prong to the - row
* **1c-4prong)** Use a wire to connect the signal prong directly to the Pi’s Pin 11

### If your sensor comes with wires already attached, follow these instructions:
**The red wire is the VDC (power), the yellow is the signal, and the black is the ground.**

* **1a-3wire)** Connect the power wire to the breadboard’s + row
* **1b-3wire)** Connect the ground wire to the - row
* **1c-3wire)** Connect the signal wire directly to the Pi’s Pin 11

#### DHT TODO 2: Test the hardware
Once that's done, test it out to see if your DHT sensor is hooked up properly! Just type `node dht.js` to get it going! You should see the temperature and humidity display in your console if it's working.

<hr>

### The LEDs
The final bit of hardware you will be attaching are two LEDs. You will also need one 330 ohm resistor for each LED, so make sure that's the kind you grab from the box. 

#### LED TODO 1: Hardware
LEDs plug directly into the breadboard. This is where all those little columns that run perpendicular to the + and - rows become important. Everything in the same column on the same side of the board (excluding the +/- rows) is connected, so by plugging wires into the same column as one of the LED pins, we can connect to it indirectly.

* **1a)** Plug one led into the breadboard. Both pins from the led should be in the same letter row of the breadboard (i.e. row e). Take note of which pin is longer, as this is important. The long pin is called the anode. The short pin is called the cathode.
* **1b)** Connect a wire between the Pi’s Pin 40 to the same column as the led’s anode (i.e. if the anode is in column 19 on the breadboard, then Pin 40 should connect to column 19 as well).
* **1c)** Connect a 330 ohm resistor between the breadboard’s - row and the column shared by the led’s cathode (i.e. if the cathode is in column 20 on the breadboard, then the resistor should be plugged into column 20 as well).
* **1d)** Plug a second led into the breadboard (in unused columns). Again, take note of which pin is longer.
* **1e)** Connect a wire between Pin 36 on the Pi and the breadboard’s column with the second led’s anode.
* **1f)** Connect a 330 ohm resistor between the breadboard’s - row and the column shared by the second led’s cathode.

#### LED TODO 2: Test the hardware

Once you're done, test it out on your Pi with `node blink.js` to see if everything works! You'll know that it does if you see the leds blinking.

#### Bonus
If you finish early, then try to make the pattern of blinking of your LEDs more creative. Maybe make them alternate which one is on, or have them blink out is some pattern. The choice is yours, but have fun with it!

#### Super Bonus
Write a program that uses the values from one (or more) of the sensors to determine if an LED should be lit or not!

Try to get one LED to turn on or off if the PIR sensor sees someone. So, if it is on and the sensor sees someone, turn it off. If it is off and the sensor sees someone, turn it on. 

The other LED should turn on after the either the temperature or humidity sensor crosses a certain threshold. Make sure to use `parseFloat()` to convert the value to a number for comparison purposes. Also make sure that you turn off the LED when it goes below the threshold.

>**WARNING:** Make sure that if the program exits, that the LEDs are shut off in the process.
