/**
 * @Author: John Isaacs <john>
 * @Date:   04-Mar-192019
 * @Filename: app.js
 * @Last modified by:   john
 * @Last modified time: 06-Mar-192019
 */


//these two lines set up the connection to our displaye server
const mqtt = require('mqtt')
const mqttClient = mqtt.connect('mqtt://rg-n432-jpi.rgu.ac.uk:1883')


var os = require('os');
 
var rpiDhtSensor = require('rpi-dht-sensor');
 
var dht = new rpiDhtSensor.DHT11(7);

//these two lines define our devices name and a topic for the display server
const devicename = os.hostname()
const topic = "temperature"

//these lines set up some infromation that is needed by the server,
//this is just so we dont have to keep typing them in
var deviceInfoIn = '/inbox/' + devicename + '/deviceInfo';
var deviceInfoOut = '/outbox/' + devicename + '/deviceInfo';
var deviceTemp = '/outbox/' + devicename + '/temperature';
var deviceHumid = '/outbox/' + devicename + '/humidity';

//here we set how fast the stream is, (how often the data is pushed to the display server)
var streamInterval;
var msFrequency = 200;

sensor.read(11, 7, function(err, temperature, humidity) {

     
    console.log('temp: ${temperature}°C, humidity: ${humidity}%');
});

/*
This bloc of code sets up the type of dispay we will see on the server and starts the connection
*/
mqttClient.on('connect', () => {
  console.log('Mqtt connected.')
 console.log(devicename)
  mqttClient.subscribe(deviceInfoIn); //subscribe
  mqttClient.subscribe(deviceTemp); //subscribe
 mqttClient.subscribe(deviceHumid); //subscribe
  
  mqttClient.publish(deviceInfoOut, JSON.stringify({
    "deviceInfo": {
      "name": devicename,
      "endPoints": {
        "temperature": {
          "title": devicename + " Temp",
          "card-type": "crouton-simple-text",
          "units": "C",
          "values": {
            "value": 39
          }
        },
        "humidity": {
            "title": devicename + " Humid",
            "card-type": "crouton-simple-text",
            "units": "%",
            "values": {
              "value": 39
            }
          },
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
  streamInterval = setInterval(working, msFrequency);
}

function working(){
    var readout = dht.read();
    var temp = readout.temperature.toFixed(2);
    var humid =readout.humidity.toFixed(2);
     /* Publish data to the display server */
      mqttClient.publish(deviceTemp, JSON.stringify({
        "value": temp
      }));
      mqttClient.publish(deviceHumid, JSON.stringify({
        "value": humid
      }));
      
     


}

function returnRandomFloat(min, max) {
  return (Math.random() * (max - min) + min).toFixed(2);
}

//this block of code handles disconnecting
mqttClient.on('offline', () => {
  console.log('Mqtt offline.')
  mqttClient.unsubscribe(deviceTemp);
  mqttClient.unsubscribe(deviceHumid);
  clearInterval(streamInterval);
})
