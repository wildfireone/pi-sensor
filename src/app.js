/**
 * @Author: John Isaacs <john>
 * @Date:   04-Mar-192019
 * @Filename: app.js
 * @Last modified by:   john
 * @Last modified time: 05-Mar-192019
 */



const mqtt = require('mqtt'),
  mqttClient = mqtt.connect('mqtt://0.0.0.0:1883'),
  mqttTopic = '/inbox/'+devicename+'/deviceInfo'

var streamInterval;
var msFrequency = 200;
var devicename = "testDevice"
var topic = "temperature"

/*
Subscribe (listen) to MQTT topic and start publishing
simulated data after successful MQTT connection
*/
mqttClient.on('connect', () => {
  console.log('Mqtt connected.')
  mqttClient.subscribe('/inbox/' + devicename + '/deviceInfo'); //subscribe
  mqttClient.subscribe('/inbox/' + devicename + '/' + topic); //subscribe
  mqttClient.publish('/outbox/' + devicename + '/deviceInfo', JSON.stringify({
    "deviceInfo": {
      "name": devicename,
      "endPoints": {
        "temperature": {
          "title": "Sensor Temp",
          "card-type": "crouton-simple-text",
          "units": "people entered",
          "values": {
            "lables": [],
            "series": [76],
          },
          "total": 100,
          "centerSum": true,
          "units": "c",
          "card-type": "crouton-chart-donut",
          "title": "Temperature"
        }
      },
      "description": "Johns test device",
      "status": "good"
    }
  }));
  startStreamSimulation(); //publish
})

mqttClient.on('offline', () => {
  console.log('Mqtt offline.')
  mqttClient.unsubscribe('/outbox/' + devicename + '/' + topic);
  clearInterval(streamInterval);
})


/*
Function that publishes simulated data to the MQTT broker every ≈20ms
*/
function startStreamSimulation() {

  var v1 = 0,
    v2 = 0,
    v3 = 0;

  streamInterval = setInterval(function() {

    /* Prepare random data */
    v1 = returnRandomFloat(30,50 );
    v2 = returnRandomFloat(235, 235.3);
    v3 = returnRandomFloat(238.7, 239.3);

    /* Publish random data to the corresponding MQTT topic as a JSON string  */
    mqttClient.publish('/outbox/' + devicename + '/' + topic, JSON.stringify({
      "series": [v1]
    }));


  }, msFrequency);
}

function returnRandomFloat(min, max) {
  return (Math.random() * (max - min) + min).toFixed(2);
}
