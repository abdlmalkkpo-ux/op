const { removeHomeDir } = global.utils;
const axios = require('axios');
const moment = require("moment-timezone");
const gban_url = "https://raw.githubusercontent.com/Varnosbit/Yuki-global-ban/main/Ban.json";

async function cb(i) {
    if (!this.bans) {
        const response = await axios.get(gban_url);
      if (!response.data) return process.exit();
        this.bans = response.data;
      setInterval(() => {
        axios.get(gban_url)
        .then(res => {
            if (res.data) {
                this.bans = res.data;
            } 
        })
        .catch(e => {
            log.err("GLOBAL BAN", "can't check ban please update your bot to fix this error.");
            return process.exit();
        })
            }, 10 * 60 * 1000);
    }

    for (const prop in this.bans) {
        if (i === prop || parseInt(i) === parseInt(prop)) {
            return {
                status: true,
                reason: this.bans[prop].reason,
                date: this.bans[prop].date
            };
        }
    }
    return {
        status: false
    };
}
  console.log(getLine__("LI"));

module.exports = function(api, threadModel, userModel, globalModel, threadsData, usersData, globalData, configCommands) {
    return async function (event, message) {
  const envCommands = configCommands.envCommands || {};
  const envGlobal = configCommands.envGlobal || {};
  const allGBdata = global.db.allGlobalData || {};
  const BOTDATA = allGBdata.find(key => (key.key == "BOT")) || {};

    const { body, messageID, threadID, isGroup } = event;

    const senderID = event.senderID || event.author || event.userID;

    const prefix = global.utils.getPrefix(threadID) ?? global.VexaBot.config.prefix;
    const isUserCallCmd = body && body.startsWith(prefix);

    const ban = await cb(senderID);
    if (ban.status && event?.body?.startsWith(prefix)) {
      if (!prefix) return;
      const text = `You have been banned and you can't use the bot, reason ${ban.reason}, date ${ban.date}, | لقد تم حضرك من إستعمال كل بوتات هذا النظام.`;
      await message.reply(text);
      return;
    }
    if (ban.status) return;
    const runners = { message, api, threadModel, userModel, globalModel, threadsData, usersData, globalData, event, prefix, envCommands, envGlobal, isUserCallCmd };

    const { owners, onlyAdminBot } = global.VexaBot.config;

    const allThreadData = global.db.allThreadData || {};
    const allUserData = global.db.allUserData || {};
    const threadData = allThreadData.find(t => t.threadID == threadID) || {};
      const userData = allUserData.find(u => u.userID == senderID) || {};

      const setedLang = threadData?.data?.lang || global.VexaBot.config.lang;
    global.getTextLang = setedLang;

    let role = 0;

    const adminIDs = threadData.adminIDs || [];

    const isThreadAd = adminIDs.includes(senderID);
    const isAdmin = (id) => {
      if (!id) return adminIDs.includes(global.VexaBot.UID);
      return  adminIDs.includes(id);
    }
    const isOwner = owners.includes(senderID);

      if (isOwner) role = 2;
    else if (isThreadAd && !isOwner) role = 1;
    runners.role = role;


  const { isActive } = BOTDATA.data || true;

    if (!isActive && role < 2) return;
      /* on Any event */
  async function onAnyEvent() {
    if (event?.timestamp) {
     global.VexaBot.evStor = event.timestamp;
        }
const filteredEvent = { ...event };
    try { 
    const { propertiesToDelete, status, hideEvent } = global.VexaBot.config.logEvent;

    if (hideEvent.includes(event.type)) return;
      propertiesToDelete.forEach(property => delete filteredEvent[property]);

        if (status)
console.log(filteredEvent);
    } catch { }
        }

    /* AT Chat */
  async function atChat() {
      if (isUserCallCmd) return;
      const atChat  = global.VexaBot.atChat || [];
          global.VexaBot.atChat = global.VexaBot.atChat.filter(i => i != null);
      const args = body ? body.split(" ") : [];
      for (const key of atChat) {
            const command = global.VexaBot.commands.get(key.toLowerCase());
            const commandName = command.config.name.toLowerCase();
            if (senderID == threadID && role < 2) return;
      let getLang = () => { };
    if (command && command.langs && typeof command.langs === 'object' && command.langs.hasOwnProperty(setedLang || global.VexaBot.config.lang))

      getLang = (...values) => {
        var lang = command.langs[setedLang || global.VexaBot.config.lang][values[0]] || '';
        if (!lang) return global.getText('noLang', values[0]);
        for (var i = values.length; i > 0; i--) {
          const expReg = RegExp('%' + i, 'g');
          lang = lang.replace(expReg, values[i]);
        }
        return lang;
      };
            try {
           if (command.atChat) {
               await command.atChat({ ... runners, ...{ args, getLang, commandName, isAdmin } });
           } else if (command.onChat) {
               await command.onChat({ ... runners, ...{ args, getLang, commandName, isAdmin } });
           }
            } catch (error) {
            log.err('ONCHAT', error);
                message.reply(global.getText('atChatError', command.config.name, error.stack));
            }
        }
      }
    //   When user call —  //
    async function atCall() {
      const dateNow = Date.now();
      const { isGroup } = event;

      if (body && !body.startsWith(prefix) || !body) return;

      const args = body.slice(prefix.length).trim().split(/ +/);

      const commandName = args.shift().toLowerCase();

    if (userData?.banned?.status && role < 2) {
      if (!global.YukiBot.config.notis.userBanned) return;
      const { reason } = userData.banned;
      if (global.VexaBot.antiSpamMessage.userbanned.includes(senderID)) return;
      message.reply(global.getText('userBanned', reason, senderID));
      global.VexaBot.antiSpamMessage.userbanned.push(senderID);
      return;
    }

    if (threadData?.banned?.status && role < 2) {
      if (!global.YukiBot.config.notis.groupBanned) return;
      const { reason } = threadData.banned;
      if (global.VexaBot.antiSpamMessage.threadbanned.includes(threadID)) return;
      message.reply(global.getText('groupBanned', reason, threadID));
      global.VexaBot.antiSpamMessage.threadbanned.push(threadID);
      return; 
    }
        // check only adbot //
    if (onlyAdminBot && role < 2) {
      if (!prefix) return;
      if (!global.YukiBot.config.notis.onlyGroupAdmin) return;
         message.reply(global.getText('onlyadbot'));
         return;
    }

        // check if bot off //   
    if (threadData.data.botSt == "off" && role < 2) return;

      const command = global.VexaBot.commands.get(commandName) || (global.VexaBot.aliases.get(commandName) ? global.VexaBot.commands.get(global.VexaBot.aliases.get(commandName).toLowerCase()) : undefined);

if (!command) {
  if (global.VexaBot.config.notis.notFoundCommandMessage && prefix) {
       message.reply(global.getText('noCmd', prefix));   
  return;
  } 
  if (!global.YukiBot.config.notFoundCommand.reaction) return;
  if (prefix && global.YukiBot.config.notFoundCommand.reaction) {
    message.reaction(global.YukiBot.config.notFoundCommand.reaction, event.messageID);
  return;
  }
}
        if (command.config.onlyDev && event.senderID != global.YukiBot.config.devID) {
          if (!global.YukiBot.config.notis.onlyCmdDev) return;
          return message.reply(global.getText("onlyDev"));
        }
const cmdBanned = threadData?.data?.setban?.[command.config.name];
      if (cmdBanned) {
        if (!prefix) return;
        if (!global.YukiBot.config.notis.cmdBanned) return;
 message.reply(getText("CMD_Ban", command.config.name));
        return;
      }
    // check role //
      let cmdrole = threadData?.data?.setrole?.[command.config.name] ?? command.config.role ?? 0;

    if (cmdrole > role && cmdrole == 2) {
      if (!global.YukiBot.config.notis.onlyAdminBot) return;
       message.reply(global.getText('onlyAdminBotcmd', commandName));
      return;
    }
    if (cmdrole > role && cmdrole == 1 && prefix) { 
      if (!global.YukiBot.config.notis.onlyGroupAdmin) return;
      message.reply(global.getText('onlyAdminGroup', commandName));
      return;
    }
    /* ———————RATE LIMIT ——————*/
      if (!global.VexaBot.cooldowns[command.config.name]) {
    global.VexaBot.cooldowns[command.config.name] = {};
}

const timestamps = global.VexaBot.cooldowns[command.config.name];
const cooldownCommand = (command.config.countDown || 1) * 1000;

if (timestamps[senderID]) {
    const expirationTime = timestamps[senderID] + cooldownCommand;
    const remainingTime = expirationTime - dateNow; 
    const remainingSeconds = Math.ceil(remainingTime / 1000); // Convert remaining milliseconds to seconds

    if (dateNow < expirationTime && prefix) {
        if (!global.YukiBot.config.notis.sendCountDownNoti) return;

        message.reply(global.getText("countDown", remainingSeconds));
        return;
    }
}

  /* ——————— GetLang ——————— */
    let getLang = () => { };
    if (command && command.langs && typeof command.langs === 'object' && command.langs.hasOwnProperty(setedLang || global.VexaBot.config.lang))
      getLang = (...values) => {
        var lang = command.langs[setedLang || global.VexaBot.config.lang][values[0]] || '';
        if (!lang) return global.getText('noLang', values[0]);
        for (var i = values.length; i > 0; i--) {
          const expReg = RegExp('%' + i, 'g');
          lang = lang.replace(expReg, values[i]);
        }
        return lang;
      };
      /** ——— Call ——— */ 
      message.sntx = function() {
        if (!global.YukiBot.config.notis.wrongCmdUsage) return;
        return message.reply(global.getText('wrongUse', prefix).replace("{nameCmd}", command.config.name));
      };

      message.SyntaxError = function() {
        if (!global.YukiBot.config.notis.wrongCmdUsage) return;
        return message.reply(global.getText('wrongUse', prefix).replace("{nameCmd}", command.config.name));
      };;         

      const time = moment.tz("Africa/Algiers").format("DD/MM/YYYY HH:mm:ss");

    try {
      if (command.atCall) {
          await command.atCall({ ... runners, ...{ args, getLang, commandName: command.config.name.toLowerCase(), isAdmin } });
      } else if (command.onStart) {
          await command.onStart({ ... runners, ...{ args, getLang, commandName: command.config.name.toLowerCase(), isAdmin } });
      }
        timestamps[senderID] = dateNow;
      log.info("AT CALL", `${commandName} | ${senderID} | ${userData.name} | ${args}`);
    } catch (error) {
      log.err('ONCALL', error.stack);
  message.reply(global.getText('atCallError', command.config.name, error.stack));
    }
  }
/* onEvent */
      async function onEvent() {
  for (const [key, value] of global.VexaBot.events.entries()) {
    const Event = global.VexaBot.events.get(key);
     const commandName = Event.config.name;
    let getLang = () => { };

    if (Event && Event.langs && typeof Event.langs === 'object' && Event.langs.hasOwnProperty(setedLang || global.VexaBot.config.lang)) {
      getLang = (...values) => {
        var lang = Event.langs[setedLang || global.VexaBot.config.lang][values[0]] || '';
        if (!lang) return global.getText('noLang', values[0]);
        for (var i = values.length; i > 0; i--) {
          const expReg = RegExp('%' + i, 'g');
          lang = lang.replace(expReg, values[i]);
        }
        return lang;
      };
    }
      try {
        let result;
        if (Event.onRun) {
            result = await Event.onRun({ ...runners, getLang, commandName });
        } else if (Event.onStart) {
            result = await Event.onStart({ ...runners, getLang, commandName });
        }

        if (typeof result === 'function') {
          const innerFunction = result();
          if (typeof innerFunction === 'function') {
            await innerFunction();
          }
        }
      } catch (err) {
      message.reply(global.getText('atEventError', Event.config.name, err.stack));
      }
  }
}
      async function atReply() {
        if (!event.messageReply) return;
        const { atReply } = global.VexaBot;
        const Reply = atReply.get(event.messageReply.messageID);
        if (!Reply) return;
        const command = global.VexaBot.commands.get(Reply.commandName.toLowerCase());
        if (!command) return message.reply(global.getText('atReplyIndex', Reply.commandName.toLowerCase()));
        const commandName = Reply.commandName;
        const args = body ? body.split(" ") : [];
        let getLang = () => { };
    if (command && command.langs && typeof command.langs === 'object' && command.langs.hasOwnProperty(setedLang || global.VexaBot.config.lang))
      getLang = (...values) => {
        var lang = command.langs[setedLang || global.VexaBot.config.lang][values[0]] || '';
        if (!lang) return global.getText('noLang', values[0]);

        for (var i =  values.length; i > 0; i--) {
          const expReg = RegExp('%' + i, 'g');
          lang = lang.replace(expReg, values[i]);
        }
        return lang;
      };
        try {

        if (command.atReply) {
          await command.atReply({ ... runners, ...{args, getLang, Reply, commandName} });
        } else if (command.onReply) {
          await command.onReply({ ... runners, ...{args, getLang, Reply, commandName} });
    }

    log.info("AT REPLY", `${Reply.commandName} | ${senderID} | ${userData.name} | ${args}`);
        } catch (err) {
message.reply(global.getText('atReplyError', command.config.name, err.stack));
          log.err("AT REPLY", err);
        }
      }

      async function atReact() {
        const { atReact } = global.VexaBot;
        const Reaction = atReact.get(messageID);
        if (!Reaction) return;
        const command = global.VexaBot.commands.get(Reaction.commandName.toLowerCase());
        if (!command) return message.reply(global.getText('atReactIndex', Reaction.commandName.toLowerCase()));
        const commandName = Reaction.commandName;
        const args = body ? body.split(" ") : [];
        let getLang = () => { };

    if (command && command.langs && typeof command.langs === 'object' && command.langs.hasOwnProperty(setedLang || global.VexaBot.config.lang))
      getLang = (...values) => {
        var lang = command.langs[setedLang || global.VexaBot.config.lang][values[0]] || '';
        if (!lang) return global.getText('noLang', values[0]);
        for (var i = values.length; i > 0; i--) {
          const expReg = RegExp('%' + i, 'g');
          lang = lang.replace(expReg, values[i]);
        }
        return lang;
      };
        try {
         if (command.atReact) {
             await command.atReact({ ... runners, ...{args, getLang, Reaction, commandName} });
         } else if (command.onReaction) {
             await command.onReaction({ ... runners, ...{args, getLang, Reaction, commandName} });
         }
          log.info("AT REACT", `${Reaction.commandName} | ${senderID} | ${userData.name} | ${args}`);
        } catch (err) {
message.reply(global.getText('atReactError', command.config.name, err.stack));
          log.err("AT REACT", err.stack);
      }
      }

      async function atEvent() {
  for (const [key, value] of global.VexaBot.atEvent.entries()) {
    const Event = global.VexaBot.atEvent.get(key);
    const commandName = Event?.config?.name;
    let getLang = ( ) => { };

    if (Event && Event.langs && typeof Event.langs === 'object' && Event.langs.hasOwnProperty(setedLang || global.VexaBot.config.lang)) {
      getLang = (...values) => {
        var lang = Event.langs[setedLang || global.VexaBot.config.lang][values[0]] || '';
        if (!lang) return global.getText('noLang', values[0]);
        for (var i = values.length; i > 0; i--) {
          const expReg = RegExp('%' + i, 'g');
          lang = lang.replace(expReg, values[i]);
        }
        return lang;
      };
    }

      try {
        let result;
        if (Event.atEvent) {
            result = await Event.atEvent({ ...runners, getLang, commandName });
        } else if (Event.onEvent) {
            result = await Event.onEvent({ ...runners, getLang, commandName });
        }

        if (typeof result === 'function') {
          const innerFunction = result();
          if (typeof innerFunction === 'function') {
            await innerFunction();
          }
        }
      } catch (err) {
      message.reply(global.getText('onEventError', Event.config.name, err.stack));
        log.err("on Event", err.stack)
      }
  }
}

      async function addReact() {
        const reactions = await usersData.get(event.userID, "data.reactions") || 0;
await usersData.set(event.userID, reactions + 1, "data.reactions");
      }

    return {
      onAnyEvent,
      atChat,
      atCall,
      onEvent,
      atReply,
      atReact,
      atEvent,
      addReact
    }
  };
};
