module.exports = {
	config: {
		name: "all",
		aliases: ["الكل"],
		version: "1.2",
		author: "allou Mohamed",
		countDown: 5,
		role: 1,
		description: {
			vi: "Tag tất cả thành viên trong nhóm chat của bạn",
			en: "Tag all members in your group chat",
			ar: "منشن الكل"
		},
		category: "box chat",
		guide: {
			vi: "   {pn} [nội dung | để trống]",
			en: "   {pn} [content | empty]",
			ar: "   {pn} [نص | خليه فارغ]"
		}
	},

	onStart: async function ({ message, event, args }) {
		const { participantIDs } = event;
		const lengthAllUser = participantIDs.length;
		const mentions = [];
		let body = args.join(" ") || "@أحبابي";
		let bodyLength = body.length;
		let i = 0;
		for (const uid of participantIDs) {
			let fromIndex = 0;
			if (bodyLength < lengthAllUser) {
				body += body[bodyLength - 1];
				bodyLength++;
			}
			if (body.slice(0, i).lastIndexOf(body[i]) != -1)
				fromIndex = i;
			mentions.push({
				tag: body[i],
				id: uid, fromIndex
			});
			i++;
		}
		message.reply({ body, mentions });
	}
};