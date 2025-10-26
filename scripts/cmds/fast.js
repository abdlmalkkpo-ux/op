const axios = require("axios");
const cheerio = require('cheerio');
function getRandomEmoji() {
    const emojiArray = [
        "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😭", "🥳", "🤩", "😍", "🥰", "😘", "😚", "😙", 
        "😗", "😉", "🙃", "😋", "🙂", "🤤", "🥲", "😏", "😊", "😌", "☺️", "😑", "😛", "😬", "😝", "🥺", 
        "😜", "😔", "🤪", "🥴", "😱", "😐", "🤗", "😶", "🥱", "🤐", "🤭", "🤔", "🤫", "😞", "🤨", "🤬", 
        "🧐", "😡", "😒", "😠", "🙄", "😤", "☹️", "😢", "🙁", "😥", "😕", "😟", "😰", "😨", "😓", "😧", 
        "😩", "😫", "😦", "😮", "😵", "🥶", "😯", "😲", "🥵", "🤢", "😳", "🤮", "🤯", "😴", "😖", "😪", 
        "😣", "👹", "🤓", "☠️", "🤑", "💀", "🤠", "👻", "😇", "👿", "🤥", "😈", "😷", "🤡", "🤕", "🥸", 
        "🤒", "😎", "🤧", "💥", "😼", "🌛", "👺", "💨", "😽", "🌜", "🎃", "💦", "🙀", "🙈", "💩", "💤", 
        "😿", "🙉", "🤖", "🕳️", "😾", "🙊", "👽", "🔥", "💫", "😺", "👾", "💯", "⭐", "😸", "🌚", "🌝", 
        "🌞", "😻", "😹", "🌟", "✨", "❤️", "🎉", "💘", "🧡", "🤍", "💛", "🖤", "💚", "🤎", "💙", "🖤", 
        "💜", "♥️", "💝", "💟", "💖", "💌", "💗", "💕", "💓", "💞", "🧠", "❣️", "👣", "💔", "🗣️", "💋", 
        "👤", "🫂", "👥", "🫀", "👄", "🫁", "👁️", "🩸", "👀", "🦠", "🦴", "🦷", "🦾", "🦿", "👅", "🤝", 
        "☘️", "🌳", "🌴", "🌵", "☃️", "⛄", "❄️", "🏔️", "🌅", "🌄", "🌏", "🌎", "🌍", "🌔", "🌓", "🌒", 
        "🌑", "🌘", "🌗", "🌖", "🌕", "🌌", "🐯", "🐹", "🐴", "🦖", "🦎", "🐕‍🦺", "🐩", "🦌", "🐘", 
        "🐁", "🐄", "🦙", "🐸", "🐍", "🐫", "🐪", "🦧", "🦍", "🐒", "🐅", "🐆", "🦒", "🦛", "🐔", "🐣", 
        "🐓", "🦤", "🦈", "🦢", "🦭", "🦆", "🐧", "🦩", "🦚", "🐋", "🦞", "🐳", "🐡", "🕸️", "🦪", "🐝", 
        "🦟", "🦋", "🦗", "🐛", "🍓", "🍌", "🍎", "🍊", "🍉", "🍐", "🫒", "🍈", "🍇", "🍋", "🌶️", "🥬", 
        "🧅", "🌽", "🥑", "🫓", "🍠", "🥜", "🧄", "🥔", "🥐", "🥓", "🥯", "🍳", "🥯", "🥞", "🍕", "🍖", 
        "🥪", "🍖", "🌭", "🥣", "🍤", "🥗", "🦞", "🍲", "🍜", "🥡", "🍡", "🍱", "🍘", "🍢", "🥟", "🎂", 
        "🥠", "🍰", "🍧", "🍦", "🧁", "🧈", "🍬", "🍪", "🧋", "🥛", "🧊", "🍵", "🛑", "🚇", "🚨", "🧭", 
        "🚨", "🚦", "🚙", "🛴", "🚲", "🛴", "🛻", "🚒", "🚚", "🚛", "🚂", "🚕", "🚝", "🛺", "🚔", "🚋", 
        "🚊", "🚎", "⛵", "🚆", "🛳️", "🚤", "🚁", "🚀", "🚠", "🛫", "🛸", "🎢", "🗿", "🎡", "🎪", "💈", 
        "🛕", "⛲", "🕍", "🕋", "🏟️", "🏠", "🏫", "🏤", "🏨", "⛺", "🏕️", "🛖", "🌆", "🏡", "🌉", "💺", 
        "🌁", "🗾", "🌁", "🎊", "🧨", "🎈", "🎁", "🪔", "🎋", "🪅", "🎎", "🎃", "🎖️", "🥇", "🥉", "📢", 
        "🥅", "⚾", "🏐", "🥎", "🏀", "🏏", "🏑", "🏸", "🥌", "🛷", "🦠", "🐾"
    ];

    const randomIndex = Math.floor(Math.random() * emojiArray.length);
    return emojiArray[randomIndex];
}

module.exports = {
  config: {
    name: "fastest",
    aliases: ["الأسرع", "الاسرع"],
    version: "1.3",
    author: "allou mohamed",
    countDown: 5,
    role: 0,
    shortDescription: {
      ar: "اسرع من يرسل إيموجي",
      en: "the fast one who send the emoji"
    },
    category: "games",
    guide: {
      ar: "   {pn}",
      en: "   {pn}"
    }
  },

  langs: {
    ar: {
      Emoji: "أول من يرسل هذا الإيموجي يفوز",
      manyRequest: "⚠️ لسيرفر معطل"
    },
    en: {      
      Emoji: "The first who send this emoji wins.",
      manyRequest: "⚠️ Server disabled"
    }
  },

  onStart: async function ({ args, message, event, getLang }) {
    const emoji = getRandomEmoji();

    let getMeaning;
    try {
      getMeaning = await getEmoji(emoji);
    }
    catch (e) {
      if (e.response && e.response.status == 429) {
        let tryNumber = 0;
        while (tryNumber < 3) {
          try {
            getMeaning = await getEmoji(emoji);
            break;
          }
          catch (e) {
            tryNumber++;
          }
        }
        if (tryNumber == 3)
          return message.reply(getLang("manyRequest"));
      }
    }
    
    let images = getMeaning.images;

    let image = images.find(i => i.platform == "Facebook");
    
    message.stream(getLang("Emoji"), "https://www.emojiall.com/"+ image.url);
    const reg = new RegExp(emoji);
    global.onListen.add(event.senderID, async ({ event }) => reg.test(event.body), async ({ message, usersData, event }) => {
	        const currentBal = await usersData.getMoney(event.senderID);
	        const neBal = currentBal + 10;
	        const txt = `😁 @${event.senderID}:\n✅ جوابك صحيح: ${emoji}\n💸 ربحت 10 دنانير تافهة و رصيدك زاد شوي صار ${neBal} دينار.`;
	        message.reply(txt);
	        await usersData.addMoney(event.senderID, 10);
	    });
  }
};

async function getEmoji(emoji) {
  const urlImages = `https://www.emojiall.com/en/image/${encodeURI(emoji)}`;
  const { data: dataImages } = await axios.get(urlImages);

  const $images = cheerio.load(dataImages);
  const getEl5 = $images(".emoji_card_content").find('img[loading="lazy"]');
  const arr = [];

  getEl5.each((i, el) => {
    const content = $images(el).parent().find("p[class='capitalize'] > a[class='text_blue']").eq(1).text().trim();
    const href = $images(el).attr("data-src") || $images(el).attr("src");
    arr.push({
      url: href,
      platform: content
    });
  });

  return {
    images: arr
  };
}

