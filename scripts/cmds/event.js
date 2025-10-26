const { join } = require("path");
const fs = require("fs-extra");
const axios = require("axios");
const { execSync } = require("child_process");
const path = require("path");
const cheerio = require("cheerio");
const allWhenChat = global.VexaBot.atChat;

const { removeHomeDir } = global.utils;

function getDomain(url) {
  const regex = /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:/\n]+)/im;
  const match = url.match(regex);
  return match ? match[1] : null;
}

function isURL(str) {
  try {
    new URL(str);
    return true;
  }
  catch (e) {
    return false;
  }
}

module.exports = {
  config: {
    name: "event",
    aliases: ["حدث", "ev"],
    version: "1.0.0",
    role: 2,
    author: "allou Mohamed",
    description: {
      en: "Load and unload events",
      ar: "تحميل أحداث للبوت"
            },
    category: "owner",
    guide: "{pn} load | unload",
    countDown: 5,
},
  langs: {
    en: {
			missingFileName: "⚠️ | Please enter the event name you want to reload",
			loaded: "✅ | Loaded event \"%1\" successfully",
			loadedError: "❌ | Failed to load event \"%1\" with error\n%2: %3",
			loadedSuccess: "✅ | Loaded successfully (%1) event",
			loadedFail: "❌ | Failed to load (%1) event\n%2",
			openConsoleToSeeError: "👀 | Fix the error",
			missingeventNameUnload: "⚠️ | Please enter the event name you want to unload",
			unloaded: "✅ | Unloaded event \"%1\" successfully",
			unloadedError: "❌ | Failed to unload event \"%1\" with error\n%2: %3",
			missingUrlCodeOrFileName: "⚠️ | Please enter the url or code and event file name you want to install",
			missingUrlOrCode: "⚠️ | Please enter the url or code of the event file you want to install",
			missingFileNameInstall: "⚠️ | Please enter the file name to save the event (with .js extension)",
			invalidUrl: "⚠️ | Please enter a valid url",
			invalidUrlOrCode: "⚠️ | Unable to get event code",
			alreadExist: "⚠️ | The event file already exists, are you sure you want to overwrite the old event file?\nReact to this message to continue",
			installed: "✅ | Installed event \"%1\" successfully, the event file is saved at %2",
			installedError: "❌ | Failed to install event \"%1\" with error\n%2: %3",
			missingFile: "⚠️ | event file \"%1\" not found",
			invalidFileName: "⚠️ | Invalid event file name",
			unloadedFile: "✅ | Unloaded event \"%1\""
		},
    ar: {
      missingFileName: "⚠️ | Please enter the event name you want to reload",
      loaded: "✅ | Loaded event \"%1\" successfully",
      loadedError: "❌ | Failed to load event \"%1\" with error\n%2: %3",
      loadedSuccess: "✅ | Loaded successfully (%1) event",
      loadedFail: "❌ | Failed to load (%1) event\n%2",
      openConsoleToSeeError: "👀 | Fix the error",
      missingeventNameUnload: "⚠️ | Please enter the event name you want to unload",
      unloaded: "✅ | Unloaded event \"%1\" successfully",
      unloadedError: "❌ | Failed to unload event \"%1\" with error\n%2: %3",
      missingUrlCodeOrFileName: "⚠️ | Please enter the url or code and event file name you want to install",
      missingUrlOrCode: "⚠️ | Please enter the url or code of the event file you want to install",
      missingFileNameInstall: "⚠️ | Please enter the file name to save the event (with .js extension)",
      invalidUrl: "⚠️ | Please enter a valid url",
      invalidUrlOrCode: "⚠️ | Unable to get event code",
      alreadExist: "⚠️ | The event file already exists, are you sure you want to overwrite the old event file?\nReact to this message to continue",
      installed: "✅ | Installed event \"%1\" successfully, the event file is saved at %2",
      installedError: "❌ | Failed to install event \"%1\" with error\n%2: %3",
      missingFile: "⚠️ | event file \"%1\" not found",
      invalidFileName: "⚠️ | Invalid event file name",
      unloadedFile: "✅ | Unloaded event \"%1\""
    }
	},
  atCall: async function({ args, message, getLang, event, eventName }) {  
    const unloadScripts = function (filename) {
      try {
        const pathevent = join(global.YukiBot.mainPath, "scripts/events", `${filename}.js`);
        
        if (!fs.existsSync(pathevent)) throw new Error(`no file ${filename}.js founded`);
        const oldevent = require(join(global.YukiBot.mainPath, "scripts/events", `${filename}.js`));
        const oldNameevent = oldevent.config.name;

        delete require.cache[require.resolve(pathevent)];
        
        
        const event = require(join(global.YukiBot.mainPath, "scripts/events", `${filename}.js`));
        const configevent = event.config;

        const nameScript = configevent.name.toLowerCase();
        
        global.VexaBot.events.delete(oldNameevent);
    
        return {
          status: "success",
          name: filename
        };
      } catch(err) {
        return {
          status: "failed",
          name: filename,
          error: err
        };
      }
    }
    
    const loadScripts = function (filename, raw) {
      
      try {
          const pathevent = join(global.YukiBot.mainPath, "scripts/events", `${filename}.js`);
        if (raw) {
          try {
      const pathevent = global.YukiBot.mainPath + "/scripts/events/" + `${filename}`;
      
      fs.writeFileSync(pathevent, raw); 
       return {
          status: "success",
          name: filename
        };
          } catch (err) {
       return {
          status: "failed",
          name: filename,
          error: err
        };
          }
        }
        
        if (!fs.existsSync(pathevent)) throw new Error(`no file ${filename}.js founded`);
        const oldevent = require(join(global.YukiBot.mainPath, "scripts/events", `${filename}.js`));
        const oldNameevent = oldevent.config.name;

        delete require.cache[require.resolve(pathevent)];
        const event = require(join(global.YukiBot.mainPath, "scripts/events", `${filename}.js`));

        const configevent = event.config;
        if (!configevent) throw new Error("Config of event undefined");

        const nameScript = configevent.name.toLowerCase();

        if (!event.config.name) throw new Error(`event without name !`);
        
        if (!event.onStart && !event.onRun) throw new Error(`event without Call function !`);
        
        
        if (event.onLoad) {
          try {
            event.onLoad({ api: globalFCA });
          } catch (error) {
            const errorMessage = "Unable to load the onLoad function of the module."
            throw new Error(errorMessage + ' ' + error);
          }
        }

        global.VexaBot.events.delete(oldNameevent);
        global.VexaBot.events.set(nameScript, event);

        return {
          status: "success",
          name: filename
        };
      } catch(err) {
        return {
          status: "failed",
          name: filename,
          error: err
        };
      }
    }

     if (
       args[0] == "load"
       && args.length == 2
     ) {
       if (!args[1])
         return message.reply(getLang("missingFileName"));
       const infoLoad = loadScripts(args[1]);
       if (infoLoad.status == "success")
         message.reply(getLang("loaded", infoLoad.name));
       else {
         message.reply(
           getLang("loadedError", infoLoad.name, infoLoad.error.name, infoLoad.error.message)
           + "\n" + infoLoad.error.stack
         );
         console.log(infoLoad.error);
       }
     }
     else if (
       (args[0] || "").toLowerCase() == "loadall"
       || (args[0] == "load" && args.length > 2)
     ) {
       const fileNeedToLoad = args[0].toLowerCase() == "loadall" ?
         fs.readdirSync(global.YukiBot.mainPath, "scripts/events")
           .filter(file =>
             file.endsWith(".js") &&
             !file.match(/(eg)\.js$/g) &&
             (process.env.NODE_ENV == "development" ? true : !file.match(/(dev)\.js$/g)) 
           )
           .map(item => item = item.split(".")[0]) :
         args.slice(1);
       const arraySucces = [];
       const arrayFail = [];

       for (const fileName of fileNeedToLoad) {
         const infoLoad = loadScripts(fileName);
         if (infoLoad.status == "success")
           arraySucces.push(fileName);
         else
           arrayFail.push(` ❗ ${fileName} => ${infoLoad.error.name}: ${infoLoad.error.message}`);
       }

       let msg = "";
       if (arraySucces.length > 0)
         msg += getLang("loadedSuccess", arraySucces.length);
       if (arrayFail.length > 0) {
         msg += (msg ? "\n" : "") + getLang("loadedFail", arrayFail.length, arrayFail.join("\n"));
         msg += "\n" + getLang("openConsoleToSeeError");
       }

       message.reply(msg);
     }
     else if (args[0] == "unload") {
       if (!args[1])
         return message.reply(getLang("missingeventNameUnload"));
       const infoUnload = unloadScripts(args[1]);
       infoUnload.status == "success" ?
         message.reply(getLang("unloaded", infoUnload.name)) :
         message.reply(getLang("unloadedError", infoUnload.name, infoUnload.error.name, infoUnload.error.message));
     }
     else if (args[0] == "install") {
       let url = args[1];
       let fileName = args[2];
       let rawCode;

       if (!url || !fileName)
         return message.reply(getLang("missingUrlCodeOrFileName"));

       if (
         url.endsWith(".js")
         && !isURL(url)
       ) {
         const tmp = fileName;
         fileName = url;
         url = tmp;
       }

       if (url.match(/(https?:\/\/(?:www\.|(?!www)))/)) {
         
         if (!fileName || !fileName.endsWith(".js"))
           return message.reply(getLang("missingFileNameInstall"));

         const domain = getDomain(url);
         if (!domain)
           return message.reply(getLang("invalidUrl"));

         if (domain == "pastebin.com") {
           const regex = /https:\/\/pastebin\.com\/(?!raw\/)(.*)/;
           if (url.match(regex))
             url = url.replace(regex, "https://pastebin.com/raw/$1");
           if (url.endsWith("/"))
             url = url.slice(0, -1);
         }
         else if (domain == "github.com") {
           const regex = /https:\/\/github\.com\/(.*)\/blob\/(.*)/;
           if (url.match(regex))
             url = url.replace(regex, "https://raw.githubusercontent.com/$1/$2");
         }

         rawCode = (await axios.get(url)).data;

         if (domain == "savetext.net") {
           const $ = cheerio.load(rawCode);
           rawCode = $("#content").text();
         }
       }
       else {
         if (args[args.length - 1].endsWith(".js")) {
           fileName = args[args.length - 1];
           rawCode = event.body.slice(event.body.indexOf('install') + 7, event.body.indexOf(fileName) - 1);
         }
         else if (args[1].endsWith(".js")) {
           fileName = args[1];
           rawCode = event.body.slice(event.body.indexOf(fileName) + fileName.length + 1);
         }
         else
           return message.reply(getLang("missingFileNameInstall"));
       }

       if (!rawCode)
         return message.reply(getLang("invalidUrlOrCode"));

       if (fs.existsSync(path.join(global.YukiBot.mainPath,"scripts","events", fileName)))
         return message.reply(getLang("alreadExist"), (err, info) => {
           global.VexaBot.atReact.set(info.messageID, {
             eventName,
             messageID: info.messageID,
             type: "install",
             author: event.senderID,
             data: {
               fileName,
               rawCode
             }
           });
         });
       else {
         const infoLoad = loadScripts(fileName, rawCode);
         infoLoad.status == "success" ?
           message.reply(getLang("installed", infoLoad.name, path.join(global.YukiBot.mainPath,"scripts/events", fileName).replace(process.cwd(), ""))) :
           message.reply(getLang("installedError", infoLoad.name, infoLoad.error.name, infoLoad.error.message));
       }
     }
     else 
message.sntx();
  },
  atReact: async function ({ Reaction, message, event, getLang }) {
        const loadScripts = function (filename, raw) {
      
      try {
          const pathevent = join(global.YukiBot.mainPath, "scripts/events", `${filename}.js`);
        if (raw) {
          try {
      const pathevent = global.YukiBot.mainPath+ "/scripts/events/"+ `${filename}`;
      
      fs.writeFileSync(pathevent, raw); 
       return {
          status: "success",
          name: filename
        };
          } catch (err) {
       return {
          status: "failed",
          name: filename,
          error: err
        };
          }
        }
        
        if (!fs.existsSync(pathevent)) throw new Error(`no file ${filename}.js founded`);
        const oldevent = require(join(global.YukiBot.mainPath, "scripts/events", `${filename}.js`));
        const oldNameevent = oldevent.config.name;

        delete require.cache[require.resolve(pathevent)];
        const event = require(join(global.YukiBot.mainPath, "scripts/events", `${filename}.js`));

        const configevent = event.config;
        if (!configevent) throw new Error("Config of event undefined");

        const nameScript = configevent.name.toLowerCase();

        if (!event.config.name) throw new Error(`event without name !`);
        
        if (!event.onStart && !event.onRun) throw new Error(`event without Call function !`);
        
        
        if (event.onLoad) {
          try {
            event.onLoad({ api: globalFCA });
          } catch (error) {
            const errorMessage = "Unable to load the onLoad function of the module."
            throw new Error(errorMessage + ' ' + error);
          }
        }

        global.VexaBot.events.delete(oldNameevent);
        global.VexaBot.events.set(nameScript, event);

        return {
          status: "success",
          name: filename
        };
      } catch(err) {
        return {
          status: "failed",
          name: filename,
          error: err
        };
      }
    }
		const { author, data: { fileName, rawCode } } = Reaction;
		if (event.userID != author)
			return;
		const infoLoad = loadScripts(fileName, rawCode);
		infoLoad.status == "success" ?
			message.reply(getLang("installed", infoLoad.name, path.join(global.VexaBot.mainPath,"scripts/events", fileName).replace(process.cwd(), ""))) :
			message.reply(getLang("installedError", infoLoad.name, infoLoad.error.name, infoLoad.error.message));
  }
};
