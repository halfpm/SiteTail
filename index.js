const colors = require("colors");
const fs = require("fs");
const Tail = require("tail").Tail;

const logsPath =
  "C:/Projects/DanskeSpil.Website/develop/Website/App_data/logs/";
let logFile;
let previousLogFile;

function findLatestLogFile() {
  fs.readdir(logsPath, function (err, files) {
    //handling error
    if (err) {
      return console.log("Unable to scan directory: " + err);
    }

    files = files.filter((file) => file.startsWith("log."));

    files.sort((fileA, fileB) => {
      const statsA = fs.statSync(logsPath + fileA);
      const statsB = fs.statSync(logsPath + fileB);
      return statsA.mtimeMs - statsB.mtimeMs;
    });

    logFile = files.pop();

    if (logFile !== previousLogFile) {
      previousLogFile = logFile;
      tailIt(logFile);
    }
  });
}

const tailOptions = {
  separator: /[\r]{0,1}\n/,
  fromBeginning: false,
  fsWatchOptions: {},
  follow: true,
  logger: console,
};

function tailIt(file) {
  console.log(`\n\n\n  LOGGING FROM: ${file} \n\n`.bgBlue.white);
  tail = new Tail(`${logsPath}${file}`, tailOptions);

  tail.on("line", function (data) {
    const now = new Date().toString().slice(16, 24).gray;

    if (data.indexOf("INFO") > -1) {
      // console.log(`${now}  ${data.gray}`)
      return;
    }

    if (data.indexOf("DEBUG") > -1) {
      // console.log(`${now}  ${data.gray}`)
      return;
    }

    if (data.indexOf("ERROR") > -1) {
      console.log(`${now}  ${data.bold.bgRed.white}`);
      return;
    }

    if (data.indexOf("WARN") > -1) {
      console.log(`${now}  ${data.black.bgYellow}`);
      return;
    }

    console.log(`${now}  ${data.white}`);
  });

  tail.on("error", function (error) {
    console.log("ERROR: ", error);
  });
}

findLatestLogFile();
setInterval(findLatestLogFile, 1000);
