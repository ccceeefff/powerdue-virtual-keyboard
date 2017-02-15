var fs = require("fs");
var midi = require("midi-node");

var files = [
  {
    name: "Super Mario Brothers",
    path: "smb.mid",
    track: 1
  },
  {
    name: "Super Mario Brothers with BPM",
    path: "supermario.mid",
    track: 0
  },
  {
		name: "Back to the Future",
		path: "future-mod2.mid",
    track: 0
	},
  // {
  //   name: "Star Wars",
  //   path: "starwars-mod.mid",
  //   track: 1
  // },
  // {
  //   name: "Cantina",
  //   path: "cantina-mod.mid",
  //   track: 1
  // }
];

module.exports = {
  allNames: function () {
    return files.map(file => file.name);
  },
  byName: function (name) {
    return new Promise(function (resolve, reject) {
      for (let file of files) {
        if (file.name === name) {
          fs.readFile("./Resources/" + file.path, function (error, data) {
            if (error) {
              reject(error);
            } else {
              var obj = {
                sequence: midi.Sequence.fromBuffer(data),
                name: name,
                track: file.track
              };
              resolve(obj);
            }
          });
          return;
        }
      }
      console.warn("Requested midi file that does not exist: " + name);
      reject(new Error("File not found"));
    });
  }
};