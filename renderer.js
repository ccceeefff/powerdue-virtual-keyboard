// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

var fs = require("fs");
var midi = require("midi-node");
var SerialPort = require('serialport');
var midiFiles = require('./midiFiles');

Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};

var keyboard = document.getElementById('keyboard');
var volumeSlider = document.getElementById('volume');
var octave = document.getElementById('octave');
var konsole = document.getElementById('console');
var trackSelect = document.getElementById('trackSelect');
var serialPortSelect = document.getElementById('serialportSelect');

function konsoleLog(message){
  konsole.value += message;
  konsole.scrollTop = konsole.scrollHeight;
}

keyboard.addEventListener('noteon', function(e) {
    var oc = parseInt(octave.value);
    var command = new Buffer([0x90, (oc * 12 + parseInt(e.detail.index)).clamp(0,127), 100]);
    port.write(command);
});

keyboard.addEventListener('noteoff', function(e) {
    var oc = parseInt(octave.value);
    var command = new Buffer([0x80, (oc * 12 + parseInt(e.detail.index)).clamp(0,127), 100]);
    port.write(command);
});

exports.volChange = function(e){
  port.write(new Buffer([0xF0, 0x04, e]));
}

exports.onLoadTrackList = function(){
  // clear all previous options
  var length = trackSelect.options.length;
  for (i = 0; i < length; i++) {
    trackSelect.options[i] = null;
  }
  
  midiFiles.allNames().forEach(function(name){
    var opt = document.createElement('option');
    opt.value = name;
    opt.innerHTML = name;
    trackSelect.add(opt);
  });
}

exports.onLoadTrack = function(){
  midiFiles.byName(trackSelect.value)
    .then(function(file){
      console.log(file.sequence.getTicks());
      var track = file.sequence.tracks[file.track];
      var buf = Buffer.concat([file.sequence.getHeader(), track.toBuffer()]);
      port.write(buf, function(){
        console.log("wrote buffer");
      }); 
    })
    .catch(function(err){
      konsoleLog(err);
    });
}

exports.onTrackStart = function(){
  port.write(new Buffer([0xFA]));
}

exports.onTrackStop = function(){
  port.write(new Buffer([0xFC]));
}

exports.onDumpTrack = function(){
  port.write(new Buffer([0xFB]));
}

exports.onSerialRefresh = function(){
  
  // clear all previous options
  var length = serialPortSelect.options.length;
  for (i = 0; i < length; i++) {
    serialPortSelect.options[i] = null;
  }
  
  SerialPort.list(function(err, ports){
    ports.forEach(function(port){
      var opt = document.createElement('option');
      opt.value = port.comName;
      opt.innerHTML = port.comName;
      serialPortSelect.add(opt);
    });
  });
}

exports.onSerialOpen = function(){
  var chosenPort = serialPortSelect.value;
  
  port = new SerialPort(chosenPort, { 
    autoOpen: false,
    baudRate: 115200,
    parser: SerialPort.parsers.readline('\n')
  });
  port.open(function (err) {
    if (err) {
      konsoleLog('Error opening port: ', err.message + '\n');
      return console.log('Error opening port: ', err.message);
    }
  });  
  
  // the open event will always be emitted 
  port.on('open', function() {
    konsoleLog("Serial open\n");
  });

  port.on('data', function(data){
    konsoleLog(data);
  });

  port.on('close', function(){
    konsoleLog('Serial Port closed..\n');
    port = null;
  });

  port.on('disconnect', function(){
    konsoleLog('Serial Port disconnected..\n');
    port = null;
  });

  port.on('error', function(e){
    konsoleLog('Serial Port error occured' + e + '\n');
    port = null;
  });
}

exports.onSerialClose = function(){
  port.close();
  port = null;
}