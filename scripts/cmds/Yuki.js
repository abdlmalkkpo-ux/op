const axios = require("axios");
const apiUrl = 'https://demanjaya.biz.id/Yuki';

module.exports = {
  config: { 
    name: "يوكي",
    version: "1.1.0",
    role: 0,
    author: "Lou Fi",
    shortDescription: "دردشة مع بوت",
    category: "البوت",
    guide: "تكلم مع يوكي",
    countDown: 2,
  },
  
  onStart: async function({ message, event, args, prefix }) {
    const { messageID, threadID, senderID } = event;
    const content = args.join(" ");
    if (!args[0]) return message.reply(`أكتب 🙂😹:\n${prefix}دخول 🌝\nإذا كنت تريد دخول مجموعتي الخاصة .-.🤍`);
    
    if (content.includes("=>")) {
      const [word, response] = content.split("=>").map(item => item.trim());
      if (!word || !response) {
        return message.reply("Please use the correct format to teach Yuki: يوكي word => response");
      }
      await teachYuki(word, response);
      return message.reply("تم تعليم يوكي بنجاح! 📚");
    }

    message.reply(`${await chatwithYuki(content)}`);
  }
}

async function chatwithYuki(word) {
  const response = await axios.get(`${apiUrl}/yuki`, {
    params: { word: word, password: "momohBIRsigma" }
  });
  return response.data.response;
}

async function teachYuki(word, response) {
  try {
    const apiResponse = await axios.get(`${apiUrl}/teach`, {
      params: {
        word: word,
        responsesToAdd: response,
        password: "momohBIRsigma"
      }
    });
    return apiResponse.data.response;
  } catch (error) {
    console.error('Error while calling the API:', error.message);
    throw error;
  }
}

    
