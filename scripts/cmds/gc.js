const { getStreamFromURL } = global.utils;

module.exports = {
  config: {
    name: 'جروب',
    version: '1.2',
    author: 'Loufi',
    countDown: 5,
    role: 0,
    shortDescription: {
      vi: 'Get information about a the group',
      en: 'جلب معلومات المجموعة'
    },
    longDescription: {
      vi: '',
      en: ''
    },
    category: 'خدمات',
    guide: '{pn}',
  },

  onStart: async function ({ message, threadsData, event, usersData, api }) {
    const threadData = await threadsData.get(event.threadID);
    let { threadID, threadName, threadThemeID, emoji, adminIDs, imageSrc, approvalMode, members } = threadData;

    let adminMentions = [];
    let adminNamesText = '';
    for (const adminID of adminIDs) {
      const userData = await usersData.get(adminID);
      adminMentions.push({ tag: '@', id: adminID, fromIndex: adminNamesText.length });
      adminNamesText += `•${userData.name} (معرفه:\n ${adminID})\n`;
    }

    let approvalModeText = approvalMode ? "شغال ✅" : "مطفي ❎";

    const memberCount = members.filter(member => member.inGroup).length;

    let messageText = `==={معلومات المجموعة}===\n❏إسم المجموعة: ${threadName}\n`;
    messageText += `❏المعرف: ${threadID}\n`;
    messageText += `❏معرف السمة: ${threadThemeID}\n`;
    messageText += `❏الإيموجي: ${emoji}\n`;
    messageText += `❏الأدمن: \n${adminNamesText}\n`;
    messageText += `❏قبول الأعضاء الجدد: ${approvalModeText}\n`;
    messageText += `❏عدد الأعضاء: ${memberCount}\n\n•صورة المجموعة:`;

    // Send the message with admin mentions
    message.reply({ body: messageText, attachment: await getStreamFromURL(imageSrc) });
  }
};