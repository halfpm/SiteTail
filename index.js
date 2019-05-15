const fs = require('fs')
const Tail = require('tail').Tail

const logsPath = 'C:/Projects/DanskeSpil.Website/develop/Website/App_data/logs/'
let logFile
let previousLogFile

function findLatestLogFile() {
  fs.readdir(logsPath, function (err, files) {
    //handling error
    if (err) {
      return console.log('Unable to scan directory: ' + err)
    }

    files = files.filter(file => file.startsWith('log.'))

    files.sort((fileA, fileB) => {
      const statsA = fs.statSync(logsPath + fileA)
      const statsB = fs.statSync(logsPath + fileB)
      return statsA.mtimeMs > statsB.mtimeMs
    })

    logFile = files.pop()

    if (logFile !== previousLogFile) {
      previousLogFile = logFile
      tailIt(logFile)
    }
  })
}

const tailOptions = {
  separator: /[\r]{0,1}\n/,
  fromBeginning: true,
  fsWatchOptions: {},
  follow: true,
  logger: console
}

function tailIt(file) {
  console.log(`\n\n ---------------- LOGGING FROM: ${file} ---------------- \n\n`)
  tail = new Tail(`${logsPath}${file}`, tailOptions)

  tail.on("line", function (data) {
    if (data.indexOf('INFO') > -1) {
      return
    }

    if (data.indexOf('ERROR') > -1) {
      console.log(colors.Underscore, data)
      return
    }

    if (data.indexOf('WARN  Unable to bind the source item') > -1) {
      console.log(colors.FgYellow, data)
      return
    }
    
    if (data.indexOf('WARN') > -1) {
      console.log(colors.FgCyan, data)
      return
    }

    console.log(colors.Reset, data)
  });

  tail.on("error", function (error) {
    console.log('ERROR: ', error)
  });
}

findLatestLogFile()
setInterval(findLatestLogFile, 1000)

const colors = {
  Reset: "\x1b[0m",
  Bright: "\x1b[1m",
  Dim: "\x1b[2m",
  Underscore: "\x1b[4m",
  Blink: "\x1b[5m",
  Reverse: "\x1b[7m",
  Hidden: "\x1b[8m",
  FgBlack: "\x1b[30m",
  FgRed: "\x1b[31m",
  FgGreen: "\x1b[32m",
  FgYellow: "\x1b[33m",
  FgBlue: "\x1b[34m",
  FgMagenta: "\x1b[35m",
  FgCyan: "\x1b[36m",
  FgWhite: "\x1b[37m",
  BgBlack: "\x1b[40m",
  BgRed: "\x1b[41m",
  BgGreen: "\x1b[42m",
  BgYellow: "\x1b[43m",
  BgBlue: "\x1b[44m",
  BgMagenta: "\x1b[45m",
  BgCyan: "\x1b[46m",
  BgWhite: "\x1b[47m"
}