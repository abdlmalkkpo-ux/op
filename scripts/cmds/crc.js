// url check image
const checkUrlRegex = /https?:\/\/.*\.(?:png|jpg|jpeg|gif)/gi;
const regExColor = /#([0-9a-f]{6})|rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)|rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(\d+\.?\d*)\)/gi;
const { IMGBB } = global.utils;

module.exports = {
	config: {
		name: "customrankcard",
		aliases: ["تخصيص", "customrank", "crc"],
		version: "1.12",
		author: "allou moha",
		countDown: 5,
		role: 0,
		shortDescription: {
			ar: "تعديل صورة الرانك امر معقد خاص بالمطور",
			en: "Design rank card by your own"
		},
		category: "rank",
		guide: {
			ar: "قل للمطور 🌝",
			en: "   {pn} [maincolor | subcolor | linecolor | progresscolor | alphasubcolor | textcolor | namecolor | expcolor | rankcolor | levelcolor | reset] <value>"
					+ "\n   In which: "
					+ "\n  + maincolor | background <value>: main background of rank card"
					+ "\n  + subcolor <value>: sub background"
					+ "\n  + linecolor <value>: color of line between main and sub background"
					+ "\n  + expbarcolor <value>: color of exp bar"
					+ "\n  + progresscolor <value>: color of current exp bar"
					+ "\n  + alphasubcolor <value>: opacity of sub background (from 0 -> 1)"
					+ "\n  + textcolor <value>: color of text (hex color or rgba)"
					+ "\n  + namecolor <value>: color of name"
					+ "\n  + expcolor <value>: color of exp"
					+ "\n  + rankcolor <value>: color of rank"
					+ "\n  + levelcolor <value>: color of level"
					+ "\n    • <value> can be hex color, rgb, rgba, gradient (each color is separated by space) or image url"
					+ "\n    • If you want to use gradient, please enter many colors separated by space"
					+ "\n   {pn} reset: reset all to default"
					+ "\n   Example:"
					+ "\n    {pn} maincolor #fff000"
					+ "\n    {pn} subcolor rgba(255,136,86,0.4)"
					+ "\n    {pn} reset"
      }
	},

	langs: {
		ar: {
    invalidImage: "رابط الصورة غير صالح، يرجى اختيار رابط صورة (jpg، jpeg، png، gif)، يمكنك تحميل الصورة على موقع https://imgbb.com/ واختيار \"الحصول على رابط مباشر\" للحصول على رابط الصورة",
    invalidAttachment: "المرفق غير صورة",
    invalidColor: "اللون غير صالح، يرجى إدخال رمز لون HEX (6 أحرف) أو رمز لون RGBA",
    notSupportImage: "رابط الصورة غير مدعوم مع الخيار \"%1\"",
    success: "تم حفظ التغييرات الخاصة بك، إليك معاينة",
    reseted: "تمت إعادة تعيين جميع الإعدادات إلى القيم الافتراضية",
    invalidAlpha: "يرجى اختيار قيمة بين 0 و 1"
},
		en: {
			invalidImage: "Invalid image url, please choose an url with image destination (jpg, jpeg, png, gif), you can upload image to https://imgbb.com/ and choose \"get direct link\" to get image url",
			invalidAttachment: "Invalid attachment, please choose an image file",
			invalidColor: "Invalid color code, please choose a hex color code (6 digits) or rgba color code",
			notSupportImage: "Url image is not supported with option \"%1\"",
			success: "Your changes have been saved, here is a preview",
			reseted: "All settings have been reset to default",
			invalidAlpha: "Please choose a number from 0 -> 1"
		}
	},

	atCall: async function ({ message, threadsData, event, args, getLang, usersData, envCommands }) {
		if (!args[0])
			return message.sntx();

		const customRankCard = await threadsData.get(event.threadID, "data.customRankCard", {});
		const key = args[0].toLowerCase();
		let value = args.slice(1).join(" ");

		const supportImage = ["maincolor", "background", "bg", "subcolor", "expbarcolor", "progresscolor", "linecolor"];
		const notSupportImage = ["textcolor", "namecolor", "expcolor", "rankcolor", "levelcolor", "lvcolor"];

		if ([...notSupportImage, ...supportImage].includes(key)) {
			const attachmentsReply = event.messageReply?.attachments;
			const attachments = [
				...event.attachments.filter(({ type }) => ["photo", "animated_image"].includes(type)),
				...attachmentsReply?.filter(({ type }) => ["photo", "animated_image"].includes(type)) || []
			];
			if (value == 'reset') {
			}
			else if (value.match(/^https?:\/\//)) {
				// if image url
				const matchUrl = value.match(checkUrlRegex);
				if (!matchUrl)
					return message.reply(getLang("invalidImage"));
				const infoFile = await IMGBB(matchUrl[0]);
				value = infoFile;
			}
			else if (attachments.length > 0) {
				// if image attachment
				if (!["photo", "animated_image"].includes(attachments[0].type))
					return message.reply(getLang("invalidAttachment"));
				const url = attachments[0].url;
				const infoFile = await IMGBB(url);
				value = infoFile;
			}
			else {
				// if color
				const colors = value.match(regExColor);
				if (!colors)
					return message.reply(getLang("invalidColor"));
				value = colors.length == 1 ? colors[0] : colors;
			}

			if (value != "reset" && notSupportImage.includes(key) && value.startsWith?.("http"))
				return message.reply(getLang("notSupportImage", key));

			switch (key) {
				case "maincolor":
				case "background":
				case "bg":
					value == "reset" ? delete customRankCard.main_color : customRankCard.main_color = value;
					break;
				case "subcolor":
					value == "reset" ? delete customRankCard.sub_color : customRankCard.sub_color = value;
					break;
				case "linecolor":
					value == "reset" ? delete customRankCard.line_color : customRankCard.line_color = value;
					break;
				case "progresscolor":
					value == "reset" ? delete customRankCard.exp_color : customRankCard.exp_color = value;
					break;
				case "expbarcolor":
					value == "reset" ? delete customRankCard.expNextLevel_color : customRankCard.expNextLevel_color = value;
					break;
				case "textcolor":
					value == "reset" ? delete customRankCard.text_color : customRankCard.text_color = value;
					break;
				case "namecolor":
					value == "reset" ? delete customRankCard.name_color : customRankCard.name_color = value;
					break;
				case "rankcolor":
					value == "reset" ? delete customRankCard.rank_color : customRankCard.rank_color = value;
					break;
				case "levelcolor":
				case "lvcolor":
					value == "reset" ? delete customRankCard.level_color : customRankCard.level_color = value;
					break;
				case "expcolor":
					value == "reset" ? delete customRankCard.exp_text_color : customRankCard.exp_text_color = value;
					break;
			}
			try {
				await threadsData.set(event.threadID, customRankCard, "data.customRankCard");
				message.reply({
					body: getLang("success"),
					attachment: await global.client.makeRankCard(event.senderID, usersData, threadsData, event.threadID, 5)
						.then(stream => {
							stream.path = "rankcard.png";
							return stream;
						})
				});
			}
			catch (err) {
				message.reply(err.stack);
			}
		}
		else if (["alphasubcolor", "alphasubcard"].includes(key)) {
			if (parseFloat(value) < 0 && parseFloat(value) > 1)
				return message.reply(getLang("invalidAlpha"));
			customRankCard.alpha_subcard = parseFloat(value);
			try {
				await threadsData.set(event.threadID, customRankCard, "data.customRankCard");
				message.reply({
					body: getLang("success"),
					attachment: await global.client.makeRankCard(event.senderID, usersData, threadsData, event.threadID, envCommands["rank"]?.deltaNext || 5)
						.then(stream => {
							stream.path = "rankcard.png";
							return stream;
						})
				});
			}
			catch (err) {
				message.reply(err.stack);
			}
		}
		else if (key == "reset") {
			try {
				await threadsData.set(event.threadID, {}, "data.customRankCard");
				message.reply(getLang("reseted"));
			}
			catch (err) {
				message.reply(err.stack);
			}
		}
		else
			message.sntx();
	}
};