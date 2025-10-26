const fs = require("fs-extra");

module.exports = {
	config: {
		name: "backupdata",
		aliases: "تخزين",
		version: "1.3",
		author: "Allou Mohamed",
		countDown: 5,
		role: 2,
		description: {
			vi: "Sao lưu dữ liệu của bot (threads, users, globalData)",
			en: "Backup data of bot (threads, users, globalData)",
			ar: "تخزين معلومات قواعد بيانات البوت."
		},
		category: "owner",
		guide: {
			en: "   {pn}",
			ar: "   {pn}"
		}
	},

	langs: {
		vi: {
			backedUp: "Đã sao lưu dữ liệu của bot vào thư mục scripts/cmds/tmp"
		},
		en: {
			backedUp: "Bot data has been backed up to the scripts/cmds/tmp folder"
		},
		ar: {
		    backedUp: "تم تخزين المعلومات بنجاح في مجلد scripts/cmds/tmp/folder"
		}
	},

	onStart: async function ({ message, getLang, threadsData, usersData, globalData }) {
		const [globalDataBackup, threadsDataBackup, usersDataBackup] = await Promise.all([
			globalData.getAll(),
			threadsData.getAll(),
			usersData.getAll()
		]);

		const pathThreads = `${__dirname}/tmp/threadsData.json`;
		const pathUsers = `${__dirname}/tmp/usersData.json`;
		const pathGlobal = `${__dirname}/tmp/globalData.json`;

		fs.writeFileSync(pathThreads, JSON.stringify(threadsDataBackup, null, 2));
		fs.writeFileSync(pathUsers, JSON.stringify(usersDataBackup, null, 2));
		fs.writeFileSync(pathGlobal, JSON.stringify(globalDataBackup, null, 2));

		message.reply({
			body: getLang("backedUp"),
			attachment: [
				fs.createReadStream(pathThreads),
				fs.createReadStream(pathUsers),
				fs.createReadStream(pathGlobal)
			]
		});
	}
};