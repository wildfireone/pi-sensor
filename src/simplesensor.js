/**
 * @Author: John Isaacs <john>
 * @Date:   05-Mar-192019
 * @Filename: simplesensor.js
 * @Last modified by:   john
 * @Last modified time: 05-Mar-192019
 */

const imu = require("node-sense-hat").Imu;

const IMU = new imu.IMU();


IMU.getValue((err, data) => {
  if (err !== null) {
    console.error("Could not read sensor data: ", err);
    return;
  }

  console.log("Accelleration is: ", JSON.stringify(data.accel, null, "  "));
  console.log("Gyroscope is: ", JSON.stringify(data.gyro, null, "  "));
  console.log("Compass is: ", JSON.stringify(data.compass, null, "  "));
  console.log("Fusion data is: ", JSON.stringify(data.fusionPose, null, "  "));

  console.log("Temp is: ", data.temperature);
  console.log("Pressure is: ", data.pressure);
  console.log("Humidity is: ", data.humidity);
});


const matrix = require('node-sense-hat').Leds;

const O = [0, 0, 255];
const X = [255, 255, 255];

const cross = [
	X, O, O, O, O, O, O, X,
	O, X, O, O, O, O, X, O,
	O, O, X, O, O, X, O, O,
	O, O, O, X, X, O, O, O,
	O, O, O, X, X, O, O, O,
	O, O, X, O, O, X, O, O,
	O, X, O, O, O, O, X, O,
	X, O, O, O, O, O, O, X,
];

matrix.setPixels(cross);

