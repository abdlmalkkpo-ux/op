const moment = require("moment-timezone");
const fs = require("fs-extra");
const axios = require("axios");
const cheerio = require("cheerio");
const Canvas = require("canvas");
const https = require("https");
const agent = new https.Agent({
	rejectUnauthorized: false
});
const { getStreamFromURL } = global.utils;

module.exports = {
	config: {
		name: "moon",
		aliases: "القمر",
		version: "1.4",
		author: "allou Mohamed",
		countDown: 5,
		role: 0,
		description: {
			vi: "xem ảnh mặt trăng vào đêm bạn chọn (dd/mm/yyyy)",
			en: "view moon image on the night you choose (dd/mm/yyyy)",
			ar: "رؤية شكل القمر في تاريخ معين"
		},
		category: "image",
		guide: {
			vi: "  {pn} <ngày/tháng/năm>"
				+ "\n   {pn} <ngày/tháng/năm> <caption>",
			en: "  {pn} <day/month/year>"
				+ "\n   {pn} <day/month/year> <caption>",
			ar: "  {pn} يوم/شهر/سنة: يعرض لك صورة القمر"
		}
	},

	langs: {
		vi: {
			invalidDateFormat: "Vui lòng nhập ngày/tháng/năm hợp lệ theo định dạng DD/MM/YYYY",
			error: "Đã xảy ra lỗi không thể lấy ảnh mặt trăng của ngày %1",
			invalidDate: "Ngày %1 không hợp lệ",
			caption: "- Ảnh mặt trăng vào đêm %1"
		},
		en: {
			invalidDateFormat: "Please enter a valid date in DD/MM/YYYY format",
			error: "An error occurred while getting the moon image of %1",
			invalidDate: "%1 is not a valid date",
			caption: "- Moon image on %1"
		},
		ar: {
		    invalidDateFormat: "إستبدل التاريخ بتاريخ مثل هذا 04/02/2006 مثلا.",
		    error: "حدث خطأ عند جلب صورة القمر في %1 لأنك أنت أجمل من القمر 🌝 أمزح انقلع ._.",
		    invalidDate: "%1 ليس تاريخ صالح جرب 04/02/2006",
		    caption: "- صورة القمر في %1"
		}
	},

	onStart: async function ({ args, message, getLang }) {
		const date = checkDate(args[0]);
		if (!date)
			return message.reply(getLang("invalidDateFormat"));
		const linkCrawl = `https://lunaf.com/lunar-calendar/${date}`;

		let html;
		try {
			html = await axios.get(linkCrawl, { httpsAgent: agent });
		}
		catch (err) {
			return message.reply(getLang("error", args[0]));
		}

		const $ = cheerio.load(html.data);
		const href = $("figure img").attr("data-ezsrcset");
		const number = href.match(/phase-(\d+)\.png/)[1];
		const imgSrc = moonImages[Number(number)];
		const { data: imgSrcBuffer } = await axios.get(imgSrc, {
			responseType: "arraybuffer"
		});

		const msg = getLang("caption", args[0])
			+ `\n- ${$($('h3').get()[0]).text()}`
			+ `\n- ${$("#phimg > small").text()}`
			+ `\n- ${linkCrawl}`
			+ `\n- https://lunaf.com/img/moon/h-phase-${number}.png`;

		if (args[1]) {
			const canvas = Canvas.createCanvas(1080, 2400);
			const ctx = canvas.getContext("2d");
			ctx.fillStyle = "black";
			ctx.fillRect(0, 0, 1080, 2400);

			const moon = await Canvas.loadImage(imgSrcBuffer);
			centerImage(ctx, moon, 1080 / 2, 2400 / 2, 970, 970);

			ctx.font = "60px \"Kanit SemiBold\"";
			const wrapText = getLines(ctx, args.slice(1).join(" "), 594);
			ctx.textAlign = "center";
			ctx.fillStyle = "white";

			const yStartText = 2095;//2042;
			//ctx.fillRect(0, 2042, 1080, 5);
			let heightText = yStartText - wrapText.length / 2 * 75;
			for (const text of wrapText) {
				ctx.fillText(text, 750, heightText);
				heightText += 75;
			}

			const pathSave = __dirname + "/tmp/wallMoon.png";
			fs.writeFileSync(pathSave, canvas.toBuffer());
			message.reply({
				body: msg,
				attachment: fs.createReadStream(pathSave)
			}, () => fs.unlinkSync(pathSave));
		}
		else {
			const streamImg = await getStreamFromURL(imgSrc);
			message.reply({
				body: msg,
				attachment: streamImg
			});
		}
	}
};


const pathFont = __dirname + "/assets/font/Kanit-SemiBoldItalic.ttf";
Canvas.registerFont(pathFont, {
	family: "Kanit SemiBold"
});

function getLines(ctx, text, maxWidth) {
	const words = text.split(" ");
	const lines = [];
	let currentLine = words[0];
	for (let i = 1; i < words.length; i++) {
		const word = words[i];
		const width = ctx.measureText(`${currentLine} ${word}`).width;
		if (width < maxWidth) {
			currentLine += " " + word;
		}
		else {
			lines.push(currentLine);
			currentLine = word;
		}
	}
	lines.push(currentLine);
	return lines;
}

function centerImage(ctx, img, x, y, sizeX, sizeY) {
	ctx.drawImage(img, x - sizeX / 2, y - sizeY / 2, sizeX, sizeY);
}

function checkDate(date) {
	const [day0, month0, year0] = (date || "").split('/');
	const day = (day0 || "").length == 1 ? "0" + day0 : day0;
	const month = (month0 || "").length == 1 ? "0" + month0 : month0;
	const year = year0 || "";
	const newDateFormat = year + "/" + month + "/" + day;
	return moment(newDateFormat, 'YYYY/MM/DD', true).isValid() ? newDateFormat : false;
}

const moonImages = [
	'https://i.ibb.co/9shyYH1/moon-0.png',
	'https://i.ibb.co/vBXLL37/moon-1.png',
	'https://i.ibb.co/0QCKK9D/moon-2.png',
	'https://i.ibb.co/Dp62X2j/moon-3.png',
	'https://i.ibb.co/xFKCtfd/moon-4.png',
	'https://i.ibb.co/m4L533L/moon-5.png',
	'https://i.ibb.co/VmshdMN/moon-6.png',
	'https://i.ibb.co/4N7R2B2/moon-7.png',
	'https://i.ibb.co/C2k4YB8/moon-8.png',
	'https://i.ibb.co/F62wHxP/moon-9.png',
	'https://i.ibb.co/Gv6R1mk/moon-10.png',
	'https://i.ibb.co/0ZYY7Kk/moon-11.png',
	'https://i.ibb.co/KqXC5F5/moon-12.png',
	'https://i.ibb.co/BGtLpRJ/moon-13.png',
	'https://i.ibb.co/jDn7pPx/moon-14.png',
	'https://i.ibb.co/kykn60t/moon-15.png',
	'https://i.ibb.co/qD4LFLs/moon-16.png',
	'https://i.ibb.co/qJm9gcQ/moon-17.png',
	'https://i.ibb.co/yYFYZx9/moon-18.png',
	'https://i.ibb.co/8bc7vpZ/moon-19.png',
	'https://i.ibb.co/jHG7DKs/moon-20.png',
	'https://i.ibb.co/5WD18Rn/moon-21.png',
	'https://i.ibb.co/3Y06yHM/moon-22.png',
	'https://i.ibb.co/4T8Zdfy/moon-23.png',
	'https://i.ibb.co/n1CJyP4/moon-24.png',
	'https://i.ibb.co/zFwJRqz/moon-25.png',
	'https://i.ibb.co/gVBmMCW/moon-26.png',
	'https://i.ibb.co/hRY89Hn/moon-27.png',
	'https://i.ibb.co/7C13s7Z/moon-28.png',
	'https://i.ibb.co/2hDTwB4/moon-29.png',
	'https://i.ibb.co/Rgj9vpj/moon-30.png',
	'https://i.ibb.co/s5z0w9R/moon-31.png'
];
