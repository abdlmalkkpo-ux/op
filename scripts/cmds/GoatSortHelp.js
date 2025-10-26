

module.exports = {
	config: {
		name: "sorthelp",
		aliases: ["ترتيب.اوامر"],
		version: "1.2",
		author: "allou Mohamed",
		countDown: 5,
		role: 0,
		description: {
			vi: "Sắp xếp danh sách help",
			en: "Sort help list",
			ar: "ترتيب قائمة اوامر البوت"
		},
		category: "utility",
		guide: {
			en: "{pn} [name | category]",
			ar: "{pn} [الإسم | الصلاحية]"
		}
	},

	langs: {
		vi: {
			savedName: "Đã lưu cài đặt sắp xếp danh sách help theo thứ tự chữ cái",
			savedCategory: "Đã lưu cài đặt sắp xếp danh sách help theo thứ tự thể loại"
		},
		en: {
			savedName: "Saved sort help list by name",
			savedCategory: "Saved sort help list by category"
		},
		ar: {
			savedName: "تم ترتيب الأوامر حسب الإسم",
			savedCategory: "تم ترتيب الأوامر حسب الفئة"
		}
	},

	onStart: async function ({ message, event, args, threadsData, getLang }) {
		if (args[0] == "name" || args[0] == "الإسم") {
			await threadsData.set(event.threadID, "name", "settings.sortHelp");
			message.reply(getLang("savedName"));
		}
		else if (args[0] == "category" || args[0] == "الصلاحية") {
			threadsData.set(event.threadID, "category", "settings.sortHelp");
			message.reply(getLang("savedCategory"));
		}
		else
			message.SyntaxError();
	}
};