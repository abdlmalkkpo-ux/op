module.exports = {
	config: {
		name: "tid",
		aliases: ["ثيد"],
		version: "1.2",
		author: "allou Mohamed",
		countDown: 5,
		role: 0,
		description: {
			vi: "Xem id nhóm chat của bạn",
			en: "View threadID of your group chat",
			ar: "معرف المجموعة"
		},
		category: "info",
		guide: {
			en: "{pn}",
			ar: "{pn}"
		}
	},

	onStart: async function ({ message, event }) {
		message.reply(event.threadID.toString());
	}
};