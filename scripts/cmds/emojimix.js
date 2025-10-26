const axios = require("axios");

module.exports = {
	config: {
		name: "emojimix",
		aliases: ["دمج"],
		version: "1.4",
		author: "allou Mohamed",
		countDown: 5,
		role: 0,
		description: {
			vi: "Mix 2 emoji lại với nhau",
			en: "Mix 2 emoji together",
			ar: "دمج ثنين إيموجيز"
		},
		guide: {
			vi: "   {pn} <emoji1> <emoji2>"
				+ "\n   Ví dụ:  {pn} 🤣 🥰",
			en: "   {pn} <emoji1> <emoji2>"
				+ "\n   Example:  {pn} 🤣 🥰",
			ar: "   {pn} <إيموجي>إيموجي 2 <>"
			    + "\n   مثال: {pn} 🐢 🍓"
		},
		category: "fun"
	},

	langs: {
		vi: {
			error: "Rất tiếc, emoji %1 và %2 không mix được",
			success: "Emoji %1 và %2 mix được %3 ảnh"
		},
		en: {
			error: "Sorry, emoji %1 and %2 can't mix",
			success: "Emoji %1 and %2 mix %3 images"
		},
		ar: {
			error: "آسف, %1 و %2 لا يدمجان معا",
			success: "%1 و %2 مدمجان معا  %3"
		}
	},

	onStart: async function ({ message, args, getLang }) {
		const readStream = [];
		const emoji1 = args[0];
		const emoji2 = args[1];

		if (!emoji1 || !emoji2)
			return message.SyntaxError();

		const generate1 = await generateEmojimix(emoji1, emoji2);
		const generate2 = await generateEmojimix(emoji2, emoji1);

		if (generate1)
			readStream.push(generate1);
		if (generate2)
			readStream.push(generate2);

		if (readStream.length == 0)
			return message.reply(getLang("error", emoji1, emoji2));

		message.reply({
			body: getLang("success", emoji1, emoji2, readStream.length),
			attachment: readStream
		});
	}
};



async function generateEmojimix(emoji1, emoji2) {
	try {
		const { data: response } = await axios.get("https://goatbotserver.onrender.com/taoanhdep/emojimix", {
			params: {
				emoji1,
				emoji2
			},
			responseType: "stream"
		});
		response.path = `emojimix${Date.now()}.png`;
		return response;
	}
	catch (e) {
		return null;
	}
}