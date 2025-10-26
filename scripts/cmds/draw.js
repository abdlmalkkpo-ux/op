const DIG = require("discord-image-generation");
const fs = require("fs-extra");

module.exports = {
	config: {
		name: "ارسمني",
        aliases: ["ارسم"],
		version: "1.1",
		author: "allou Mohamed",
		countDown: 5,
		role: 0,
		shortDescription: "يرسمك 😹",
		longDescription: "",
		category: "صور",
		guide: {
			vi: "{pn} [@tag | để trống]",
			en: ""
		}
	},

	onStart: async function ({ event, message, usersData }) {
		const uid = Object.keys(event.mentions)[0] || event.senderID;
		const avatarURL = await usersData.getAvatarUrl(uid);
		const img = await new DIG.Bobross().getImage(avatarURL);
		const pathSave = `${__dirname}/tmp/${uid}_draw.png`;
		fs.writeFileSync(pathSave, Buffer.from(img));
		message.reply({body: 'أبشر 😅',
			attachment: fs.createReadStream(pathSave)
		}, () => fs.unlinkSync(pathSave));
	}
};