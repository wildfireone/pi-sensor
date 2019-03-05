/**
 * @Author: John Isaacs <john>
 * @Date:   04-Mar-192019
 * @Filename: app.js
 * @Last modified by:   john
 * @Last modified time: 05-Mar-192019
 */


//these two lines set up the connection to our displaye server
const mqtt = require('mqtt')
const mqttClient = mqtt.connect('mqtt://0.0.0.0:1883')

//these two lines define our devices name and a topic for the display server
const devicename = "testDevice"
const topic = "temperature"

//these lines set up some infromation that is needed by the server,
//this is just so we dont have to keep typing them in
var deviceInfoIn = '/inbox/' + devicename + '/deviceInfo';
var deviceInfoOut = '/outbox/' + devicename + '/deviceInfo';
var deviceTelemetery = '/outbox/' + devicename + '/deviceInfo';

//here we set how fast the stream is, (how often the data is pushed to the display server)
var streamInterval;
var msFrequency = 200;

/*
This bloc of code sets up the type of dispay we will see on the server and starts the connection
*/
mqttClient.on('connect', () => {
  console.log('Mqtt connected.')
  mqttClient.subscribe(deviceInfoIn); //subscribe
  mqttClient.subscribe(deviceTelemetery); //subscribe
  mqttClient.publish(deviceInfoOut, JSON.stringify({
    "deviceInfo": {
      "name": devicename,
      "endPoints": {
        "temperature": {
          "title": "Sensor Temp",
          "card-type": "crouton-simple-text",
          "units": "C",
          "values": {
            "value": 39
          },
        }
      },
      "description": "Johns test device",
      "status": "good"
    }
  }));
  startStream(); //publish
})

/*
This function controls sending data to the server
*/
function startStream() {
  //set up a variable for the temperature
  var temp = 0;


  streamInterval = setInterval(function() {

    /* Prepare random data */
    temp = returnRandomFloat(30, 50);

    /* Publish data to the display server */
    mqttClient.publish(deviceTelemetery, JSON.stringify({
      "value": temp
    }));


  }, msFrequency);
}

function returnRandomFloat(min, max) {
  return (Math.random() * (max - min) + min).toFixed(2);
}

//this block of code handles disconnecting
mqttClient.on('offline', () => {
  console.log('Mqtt offline.')
  mqttClient.unsubscribe(deviceTelemetery);
  clearInterval(streamInterval);
})
