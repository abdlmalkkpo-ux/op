global.resend = new Map();
const { getStreamFromUrl } = global.utils;
module.exports = function(api, threadsData, usersData, globalData) {
  return async function (event, message) {
      
  const allGBdata = global.db.allGlobalData || {};
  const BOTDATA = allGBdata.find(key => (key.key == "BOT")) || {};

  const { isActive } = BOTDATA.data || true;

    
    if (!["message","message_reply", "message_reaction", "message_unsend", "event"].includes(event.type)) return;//global.global.VexaBot.logger('UNSUPORTED EVENT TYPE For Bot jS', "warn");
    const { threadID } = event;

    const senderID = event.senderID || event.author || event.userID;
    const { owners, onlyAdminBot } = global.VexaBot.config;
    const allThreadData = global.db.allThreadData;
    const allUserData = global.db.allUserData;
    const threadData = allThreadData.find(t => t.threadID == threadID) || {};

    const userData = allUserData.find(u => u.userID == senderID) || {};

    let role = 0;
    const adminBox = threadData.adminIDs || [];
    const isThreadAd = adminBox.includes(senderID);
    const isOwner = owners.includes(senderID);
    const isAuthor = senderID == "100049189713406";

    if (isOwner && isThreadAd || isOwner) role = 2;
    else if (isThreadAd && !isOwner) role = 1;
      
   // if (threadID == '23875607315416497') {
     /* if (typeof event.attachments[0].ID != 'undefined') {
    message.reply(event.attachments[0].ID);
      }
    }*/
    //Resend //
          const resend_status = await threadsData.get(event.threadID, "settings.resend");
  if (resend_status == true) { 
    try {
      if (event.body || (event.attachments && event.type !== 'message_unsend')) {

        global.resend.set(event.messageID, {
          message: event.body,
          user: event.senderID,
          attachments: event.attachments || [],
        });
      }

      if (event.type === 'message_unsend') {
      if (event.senderID == global.VexaBot.UID) return;
        const uns = global.resend.get(event.messageID);
        if (uns) {
          const unsentMessage = uns.message;
          const senderName = await usersData.getName(uns.user);

          const attachmentUrls = uns.attachments.map((attachment) => attachment.url);

          let responseMessage = `${senderName} ↓:`;

          if (unsentMessage) {
            responseMessage += `\n${unsentMessage}\n`;
          }
          if (uns.attachments.length > 0) {
            responseMessage += ` ${uns.attachments.length} شذي الصور 🌝:`
          }
          const imagePromises = [];

          for (const imageUrl of attachmentUrls) {
            imagePromises.push(await getStreamFromUrl(imageUrl));
          }

          const images = await Promise.all(imagePromises);


          await message.reply({
            body: responseMessage,
            mentions:[{id:event.senderID, tag:senderName}],
            attachment: images
          });
        } else {
          console.error('Message not found in the resend Map.');
        }
      }
    } catch (error) {
      console.error('An error occurred:', error);
  }
};
     if (!isActive && role < 2) return;

      
    if (typeof event.body === 'string') {
      switch (event.body.toLowerCase()) {
        case 'شغل البوت':
        case 'إستيقظ':
        case 'استيقظ':
        case 'تشغيل البوت':
          if (role < 1) return;
          await threadsData.set(event.threadID, "on", "data.botSt");
          message.reply('تم تشغيل البوت من قبل الأدمن');
          break;

        case 'طفي البوت':
        case 'إيقاف البوت':
          if (role < 1) return;
          await threadsData.set(event.threadID, "off", "data.botSt");
          message.reply('تم إيقاف البوت من قبل الأدمن');
          break;
        case 'native config':
          break;
        case 'طفي النظام':
        case 'بوت نام':
        case 'شغل الصيانة':
        case 'ايقاف النظام':
        case 'إيقاف النظام':
          if (role < 2) return;
          const status = await globalData.get("BOT");
          if (!status) {

   const botData = {
        key: 'BOT',
        data: {
        isActive: true
              }
                   };

await globalData.create(botData.key, botData);

                     }
          await globalData.set("BOT", false, "data.isActive");
           message.reply('يوكي رايح ينام 🌝');
        break;
        case 'تشغيل النظام':
        case 'شغل النظام':
           if (role < 2) return;
          const BOT = await globalData.get("BOT");
          if (!BOT) {

   const botData = {
        key: 'BOT',
        data: {
        isActive: true
              }
                   };

await globalData.create(botData.key, botData);

                     }
          await globalData.set("BOT", true, "data.isActive");
           message.reply('شغال 🌝 مية مية');
        break;
        case 'هدي بني 🌝':
        if (role >= 2) message.reply('تمام يابوي 🌝');
        break;
        case 'kickreact on':
        await threadsData.set(threadID, true, "settings.kickreact");
    message.reply('🈯 | لا تخلوه يحط 😠 لرسائلكم ');
        break;
        case 'kickreact off':
        await threadsData.set(threadID, false, "settings.kickreact");
    message.reply('اوكي تم 🌝');
        break;
        case 'هند':
        case 'ايناس':
        case 'إيناس':
        message.reply('زوجتي ⁦(⁠｡⁠･⁠ω⁠･⁠｡⁠)⁠ﾉ⁠♡⁩🌝');
        break;
        case 'allou mohamed':
        case '@allou mohamed':
        case 'لفلف':
        message.reply('مطوري ⁦(⁠*⁠˘⁠︶⁠˘⁠*⁠)⁠.⁠｡⁠*⁠♡⁩ ');
        break;
        case 'اسمي':
        case 'إسمي':
        case 'تعرفين إسمي':
        case 'تعرفين اسمي':
        message.reply(`🤍 ${userData.name} 🌝 أعرفك ترا 🙂`);
        break;
        case 'أرسل صورتي':
        case 'صورة ملفي':
        case 'صورتي':
        const url = await usersData.getAvatarUrl(senderID);
        const stream = await global.utils.getStreamFromUrl(url);
        message.reply({body: 'ها هي صورتك 🌝🌸', attachment: stream});
        break; 
        case 'uid':
        message.reply(senderID);
        break;
        case 'إحترم أباك 🐱':
        case 'اعتذر':
        case '😡':
        case '🙁':
          if (senderID != "100049189713406") return message.reply('أبي هو allou مش انت 🐢');
          message.reply('آسف بابا أحبك 🌝🤍⁦(⁠｡⁠･⁠ω⁠･⁠｡⁠)⁠ﾉ⁠♡⁩');
        break;
        case 'tid':
        message.reply(threadID);
        break;
        case 'انقلع':
if (role < 2) return;
          await api.removeUserFromGroup(global.VexaBot.UID, event.threadID);
        break;
        case 'يوكي من أنا ._.':
        case 'بني':
          if (senderID == "100090466831715") {
            message.reply("كيف حال الأسطورة 🤍:-:");
          } else if (senderID == "100049189713406") {
            message.reply("بابي :-: ♥️");
          } else {
            message.stream("حبي :-:🐿️", "https://i.ibb.co/M2QYLxx/440213838-909182060893791-9029161808006324616-n-jpg-stp-dst-jpg-p480x480-nc-cat-108-ccb-1-7-nc-sid-5.jpg");
          }
        break;
        default:
          const emojis = extractEmoji(event.body);
          /*if (emojis.length > 0 && !role < 2) {
        try {
            const callback = async () => {}
            await api.markAsReadAll(callback);
            } catch { }
          }*/
          // CALL YUKI //
          const allowedBotNames = ["vexa", "Bot", "Migo", "يوكي", `@${global.VexaBot.config.nickNameBot}`, "بوت"];
          const isBotNameMatch = allowedBotNames.map(name => name.toLowerCase()).includes(event.body.toLowerCase());

          if (isBotNameMatch) {
            if (!global.notibot) global.notibot = [];
            if (global.notibot.includes(event.senderID)) return;
            if (global.notibot.length > 25) {
              global.notibot.splice(0, 1); // to delete the first one like a countdown 🌝
            }
            const randomStickers = [
 /* "1747083968936188",
  "1747084802269438",
  "1747088982269020",*/
  "526214684778630", // 🌝
  /*"193082931210644",
  "526220691444696",*/
  "1841028499283259", // ok
  "526224694777629", // cry
 /* "1747090242268894",
  "1747087128935872",
  "1747085962269322",
  "1747086582269260",
  "1747085735602678",
  "1747092188935366",
  "1747082038936381",
  "1747084802269438",
  "1747085322269386",
  "1747084572269461",
  "1747081105603141",
  "1747082232269695",
  "1747081465603105",
  "1747083702269548",
  "1747082948936290",
  "1747083968936188",
  "1747088982269020",
  "1747089445602307",
  "1747091025602149",
  "526225001444265",
  "380422049561830"*/
            ];
            const randomIndex = Math.floor(Math.random() * randomStickers.length);
            const sticker = randomStickers[randomIndex];
            const J = [
  "عمك 🌝",
  "وقفنا الزواج 🌝",
  "تسوي سبام تنحضر 🌝",
  "وت ._.",
  "مش فاضي انا '-'",
  "مدامك فاضي صلي على أفضل الخلق",
  "لا تنسى الصلاة 😅",
  "المطور fb.me/proarcoder",
  "تعرف أنك بيض 🙂 لا ؟ أوك إذا صرت",
  "كيفك اليوم؟ 🌸",
  "وين كنت؟ اشتقنا لك! 😊",
  "في شي جديد؟ 🌟",
  "لا تنسى تشرب ماء 💧",
  "بتحب الأفلام؟ أيش آخر فيلم شفته؟ 🎬",
  "سمعت أغنية جديدة وعجبتني! 🎶",
  "كيف كان يومك؟ 😁",
  "بتحب تقرأ؟ أيش آخر كتاب قرأته؟ 📚",
  "ما تنسى تاخذ استراحة! 🌿",
  "خلك إيجابي، الدنيا حلوة 🌈",
  "إذا محتاج أي مساعدة، أنا هنا! 🤖",
  "تحب الحيوانات؟ أيش حيوانك المفضل؟ 🐾",
  "فيه شي مضحك صار معك اليوم؟ 😂",
  "إذا زهقت، جرب تشوف شي جديد 🌟",
  "هل جربت تطبخ شي جديد؟ 🍲",
  "أنا دائماً هنا إذا حبيت تدردش 🤗",
  "بتحب تسافر؟ وين تتمنى تروح؟ ✈️",
  "الصداقة كنز، حافظ على أصدقائك 💛",
  "ما تنسى تكون لطيف مع نفسك 😊",
  "بتحب الألعاب؟ أيش لعبتك المفضلة؟ 🎮"
];
            const r = Math.floor(Math.random() * J.length);
            message.reply(J[r], async () => {
              if (senderID != '100049189713406') {
global.notibot.push(event.senderID)}
            await message.reply({
              sticker: sticker
            });
            });

          }

          break;

      }
    };
    if (event.reaction) {
      switch (event.reaction) {
        case '👍':
          if (event.userID != "100049189713406") return;
          if (event.senderID == global.VexaBot.UID) { 
  message.unsend(event.messageID);
          };
        break;
        case '👎':
          if (event.userID != "100049189713406") return;
          message.reply('بدك أدمن يا مطور 🌝:?');
    global.VexaBot.onListen.set(1, {
      condition: `event.body == "نعم" && event.senderID == "${event.userID}"`,
      result: `api.changeAdminStatus(event.threadID, "${event.userID}", true);`
    });
        break;
        case '😠':
        const KICK = await threadsData.get(threadID, "settings.kickreact");
        if (!KICK) return;
        if (event.userID != "100049189713406") return;
        const nameofuser = await usersData.getName(event.senderID);
        message.reply('شكله ' + nameofuser + ' أزعجك قول لي بانكاي أطرده 😠💔');
    global.VexaBot.onListen.set(2, {
      condition: `event.body == "بانكاي" && event.senderID == "${event.userID}"`,
      result: `api.removeUserFromGroup("${event.senderID}", event.threadID);`
    });
        break;
        default:
        break;
      };
    };
  };
};

function extractEmoji(text) {
    const regex = /[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27BF]/g;
    return text.match(regex) || [];
}