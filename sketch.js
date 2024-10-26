
// let img;
let video;
let detector;
let detections = [];
let detectedState = '';
let recycleCount = 0;


let pHtmlMsg;
let serialOptions = { baudRate: 9600 };
let serial;


function preload() {
  // img = loadImage('dog_cat.jpg');
  detector = ml5.objectDetector('cocossd');
}

// function gotDetections(error, results) {
//   if (error) {
//     console.error(error);
//   }
//   detections = results;
//   detector.detect(video, gotDetections);
// }

function setup() {
  createCanvas(900, 750);
  video = createCapture(VIDEO);
  video.size(900, 750);
  video.hide();
  detector.detect(video, gotDetections);


  // Setup Web Serial using serial.js
  serial = new Serial();
  serial.on(SerialEvents.CONNECTION_OPENED, onSerialConnectionOpened);
  serial.on(SerialEvents.CONNECTION_CLOSED, onSerialConnectionClosed);
  serial.on(SerialEvents.DATA_RECEIVED, onSerialDataReceived);
  serial.on(SerialEvents.ERROR_OCCURRED, onSerialErrorOccurred);

  // If we have previously approved ports, attempt to connect with them
  //serial.autoConnectAndOpenPreviouslyApprovedPort(serialOptions);

  // Add in a lil <p> element to provide messages. This is optional
  pHtmlMsg = createP("Click anywhere on this page to open the serial connection dialog");
  
}

function mouseClicked() {
  if(!serial.isOpen()){
    serial.connectAndOpen(null, serialOptions);
  }
}

function gotDetections(error, results) {
  if (error) {
    console.error(error);
  }
  detections = results;
  detector.detect(video, gotDetections);
}


function draw() {
  image(video, 0, 0);

  for (let i = 0; i < detections.length; i++) {
    let object = detections[i];
    stroke(255,0,0);
    strokeWeight(4);
    noFill();
    rect(object.x, object.y, object.width, object.height);
    noStroke();
    fill(255);
    textSize(24);
    if(object.label == 'book'){
      object.label = 'paper';
    }
    if(object.label == 'fork'){
      object.label = 'plastic fork';
    }

    text(object.label, object.x + 10, object.y + 24);
    if(object.label == 'bottle' || object.label == 'can' || object.label =='cup' ||object.label =='paper' || object.label == 'knife' || object.label == 'plastic fork'){
      if(object.label == 'book'){
        object.label == 'paper';
      }
      text('This is recyclable', object.x + 10, object.y + 50);
      stroke(0,255,0);
      strokeWeight(4);
      noFill();
      rect(object.x, object.y, object.width, object.height);
      noStroke();
      detectedState = 'recyclable';
      // recycleCount++
      // stroke(0,255,0);
      // noFill();
      // text('Items Recycled:' + recycleCount, 650, 30);
      } else {
        text('This is not recyclable - trash', object.x + 10, object.y + 50); 
        detectedState = 'not recyclable - trash';
      }

    sendData(detectedState);


  }
}

async function sendData(detectedState){
  console.log(detectedState);
  if(serial.isOpen()){
    if(detectedState == 'recyclable'){
      serial.writeLine("1");
    }
    else {
      serial.writeLine("0");
    }

    
  }
}



/**
 * Callback function by serial.js when there is an error on web serial
 * 
 * @param {} eventSender 
 */
function onSerialErrorOccurred(eventSender, error) {
  //console.log("onSerialErrorOccurred", error);
  pHtmlMsg.html(error);
}

/**
 * Callback function by serial.js when web serial connection is opened
 * 
 * @param {} eventSender 
 */
function onSerialConnectionOpened(eventSender) {
  //console.log("onSerialConnectionOpened");
  pHtmlMsg.html("Serial connection opened successfully");
}

/**
 * Callback function by serial.js when web serial connection is closed
 * 
 * @param {} eventSender 
 */
function onSerialConnectionClosed(eventSender) {
  //console.log("onSerialConnectionClosed");
  pHtmlMsg.html("onSerialConnectionClosed");
}

/**
 * Callback function serial.js when new web serial data is received
 * 
 * @param {*} eventSender 
 * @param {String} newData new data received over serial
 */


// function sendState(detectedState) {
//   if(detectedState == 'recyclable'){
//     serial.write('1');
//   }
//   else {
//     serial.write('0');
//   }

// }

function onSerialDataReceived(eventSender, newData, detectedState) {
//read the data from the arduino
console.log(detectedState);
  // console.log(newData);
//if the object is recyclable, then send 1 to the arduino (1= recyclable, 0= trash)
 
}





