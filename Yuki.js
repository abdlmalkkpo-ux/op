const google = require("googleapis").google;
const nodemailer = require("nodemailer");
const { execSync } = require('child_process');
const logg = require('./logger/log.js');
log = logg;
const fs = require("fs");
const path = require("path");
const axios = require('axios');
const moment = require("moment-timezone");
const { NODE_ENV } = process.env;
process.env.BLUEBIRD_W_FORGOTTEN_RETURN = 0;

function getLineFunc(i) {
  const consoleWidth = 25;
  let text;

  switch (i) {
    case "DB":
      text = "DATABASE";
      break;
    case "FB":
      text = "LOG IN BOT";
      break;
    case "CE":
      text = "CMDS AND EVENTS";
      break;
    case "LI":
      text = "LISTEN";
      break;
    default:
      text = "Yuki Bot V4";
      break;
  }

  const borderColor = "\x1b[93m";
  const resetColor = "\x1b[0m";
  const lineChar = "─";

  const totalBorderLength = consoleWidth - text.length - 4;
  const leftBorderLength = Math.floor(totalBorderLength / 2);
  const rightBorderLength = totalBorderLength - leftBorderLength;

  const line = borderColor
    + lineChar.repeat(leftBorderLength)
    + " "
    + text
    + " "
    + lineChar.repeat(rightBorderLength)
    + resetColor;

  return line;
}

getLine__ = getLineFunc;

// 🔧 تم تعديل المسارات لتناسب الملفات الموجودة (.js بدلاً من .json)
const dirConfig = path.normalize(`${__dirname}/config.js`);
const dirAccount = path.normalize(`${__dirname}/account.txt`);
const dirConfigCommands = path.normalize(`${__dirname}/configCommands.json`);

// ⚠️ تم تعطيل فحص JSON لأن الملفات ليست بصيغة .json
function validJSON() { return true; }

for (const pathDir of [dirConfig, dirConfigCommands]) {
  try {
    validJSON(pathDir);
  } catch (err) {
    log.error("CONFIG", `Invalid JSON file "${pathDir.replace(__dirname, "")}":\n${err.message}\nPlease fix it and restart bot`);
    process.exit(0);
  }
}

const config = require(dirConfig);
if (config.whiteListMode?.whiteListIds && Array.isArray(config.whiteListMode.whiteListIds))
  config.whiteListMode.whiteListIds = config.whiteListMode.whiteListIds.map(id => id.toString());

const configCommands = require(dirConfigCommands);
const login = require('./yuki-chat-api');

global.YukiBot = {
  cooldowns: {},
  commands: new Map(),
  events: new Map(),
  aliases: new Map(),
  countDown: new Map(),
  atChat: [],
  atReact: new Map(),
  atReply: new Map(),
  atEvent: new Map(),
  onListen: new Map(),
  Event: [],
  mainPath: process.cwd(),
  config: config,
  configCommands: configCommands,
  envCommands: configCommands.envCommands,
  envGlobal: configCommands.envGlobal,
  dirConfig: dirConfig,
  dirConfigCommands: dirConfigCommands,
  dirAccount: dirAccount,
  antiSpamMessage: {
    wait: [],
    threadbanned: [],
    userbanned: []
  },
  UID: null,
  log: logg,
  cmdsPath: path.join(__dirname, "scripts", "cmds"),
  eventsPath: path.join(__dirname, "scripts", "events"),
  cachePath: path.join(__dirname, "scripts", "cmds", "cache"),
  api: null,
  start: Date.now() - process.uptime() * 1000,
};

global.YukiBot.config.rf_Listen = 60 * 60 * 1000;
global.VexaBot = global.YukiBot;
global.GoatBot = global.YukiBot;
global.GoatBot.onReply = global.YukiBot.atReply;
global.GoatBot.onReaction = global.YukiBot.atReact;
global.GoatBot.config.adminBot = global.YukiBot.config.owners;
global.GoatBot.config.language = global.YukiBot.config.lang;

global.db = {
  allThreadData: [],
  allUserData: [],
  allGlobalData: [],
  threadModel: null,
  userModel: null,
  globalModel: null,
  threadsData: null,
  usersData: null,
  globalData: null,
  receivedTheFirstMessage: {}
};

global.DB = {
  database: {
    creatingThreadData: [],
    creatingUserData: [],
    creatingDashBoardData: [],
    creatingGlobalData: []
  }
};

global.temp = {
  createThreadData: [],
  createUserData: [],
  createThreadDataError: [],
  filesOfGoogleDrive: {
    arraybuffer: {},
    stream: {},
    fileNames: {}
  }
};

global.client = {
  dirConfig,
  dirConfigCommands,
  dirAccount
};

const utils = require('./utils.js');
global.utils = utils;
Vexa = utils;

require('./languages/getText.js');
try {
  VexaBot.dirconfig = path.join(global.VexaBot.mainPath, "config.js");
} catch (error) {
  log.err('cant Load config');
  process.exit();
}

if (config.autoCleanCache) {
  fs.readdir(global.VexaBot.cachePath, (err, files) => {
    if (err) {
      log.info("created cache folder.");
      fs.mkdir("./scripts/cmds/cache", () => {});
    } else {
      if (files.length !== 0) {
        files.forEach(file => {
          const filePath = path.join(global.VexaBot.cachePath, file);
          fs.unlink(filePath, () => {});
        });
      }
    }
  });
}

const _________ = require("./yuki/core/login.js");
(async () => {
  process.on('unhandledRejection', error => console.log(error));
  process.on('uncaughtException', error => console.log(error));
  await _________(global.YukiBot.mainPath, config, global.YukiBot.configCommands);
})();
