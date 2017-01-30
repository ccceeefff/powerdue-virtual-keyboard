# PowerDue Virtual Keyboard

This tool allows you to test your PowerDue MIDI Instrument locally. Features include:
- Establishing serial connection
- Serial console output
- Sending Note On / Note Off Events
- Volume Change
- Loading of MIDI Tracks
- Start / Stop of MIDI Tracks

## Requirements

To run this tool, you will need to install node.js. Visit https://nodejs.org and download the latest installation for your platform.

## Getting Started

1. Download or clone this repository to your local machine.
2. In your terminal/console of choice, switch to the directory of the project
3. Install all node.js dependencies by running `npm install`
4. Rebuild the electron runtime for it to function with the native serialportm module: `npm run rebuild`
5. Once all dependencies have installed, run `npm start` to launch the app.

**NOTE**: Some users will experience version mismatches between Electron and Node.js. When this happens, look up the documentation on Electron on rebuilding for native node.js modules: http://electron.atom.io/docs/tutorial/using-native-node-modules/

**NOTE2**: Make sure to update/pull this tool often. More updates will be added over the coming days.

## Using the tool

Using the tool is straightforward. First, you must connect your PowerDue to an open serial port. Upload your firmware code using the Arduino IDE. Once the firmware is loaded, you may launch this app and open a serial connection to your target serial port. Once a connection is established, you can send any MIDI event using the virtual keyboard, or load up a track and play back a sequence.

Any outputs from the serial port from your PowerDue will be logged in bottom console of the app.

## Troubleshooting

If something isn't working right, contact the following below with a detailed description of the problem (screenshots help too).
- Cef Ramirez (cef.ramirez@sv.cmu.edu)

## Contributing

The tool, obviously, can be improved a lot further. If you have fixes and improvements to add, feel free to send in pull requests.