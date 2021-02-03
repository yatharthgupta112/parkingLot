const repl = require("repl");
const createParkingLot = require("./parking");
const fs = require("fs");

let parkingLot;
let fileWrite;
let outputFile;
async function myEval(cmd, context, filename, callback) {
  let args = cmd.trim().split(" ");
  let message;
  let error = null;
  fileWrite = context.fileWrite || false;
  try {
    if (args[0] == "my_program") {
      fileWrite = true;
      outputFile = args[3];
      fs.writeFileSync(outputFile, "");
      const data = await fs.readFileSync(args[1]).toString();
      const arr = data.split("\n");
      message = data.toString();
      for (let command of arr) {
        context.fileWrite = true;
        await myEval(command, context, filename, callback);
      }
      context.fileWrite = false;
      process.exit();
    } else if (args[0] != "create_parking_lot" && !parkingLot) {
      error = "No parking lot Found";
    } else if (args[0] == "create_parking_lot") {
      if (!parkingLot) {
        parkingLot = createParkingLot(args[1]);
        message = `Created a parking lot with ${args[1]} slots`;
      } else {
        error = "Parking Already exist";
      }
    } else {
      const actualArgs = args.splice(1, args.length - 1);
      message = parkingLot[args[0]](...actualArgs);
    }
  } catch (e) {
    error = e;
  }
  if (message) callback(null, message);
  else callback(null);
}

function myWriter(output, q,w,r) {
  if (fileWrite) {
    fs.appendFileSync(outputFile, output);
    fs.appendFileSync(outputFile, "\n");
    return "";
  }
  return output;
}

let stream = fs.createWriteStream("output.txt", { flags: 'a', mode: 0666 ,autoClose:false});

repl.start({
  prompt: "",
  eval: myEval,
  // input:process.stdin,
  // terminal: false,
  // output: process.stdout.pipe(stream),
  writer: myWriter,
});
