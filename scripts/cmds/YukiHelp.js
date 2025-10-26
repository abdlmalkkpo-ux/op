const { commands } = global.YukiBot;

const config = {
    name: "help",
    aliases: ["أوامر", "اوامر", "مساعدة", "الاوامر", "الأوامر"],
    description: {
        en: "Arabic help list",
        ar: "قائمة أوامر عربية."
    },
    role: 0,
    guide: {
        en: "{pn}",
        ar: "{pn} | رقم الصفحة | الكل"
    },
    category: "دليل الإستعمال",
    ar: 1
};

const atCall = async ({ message, args }) => {
    let pageIndex = args[0] ? parseInt(args[0]) : 1;
    const isAllCommandsRequested = args[0] === "الكل";

    if (isNaN(pageIndex) && !isAllCommandsRequested) {
        return message.reply("لا توجد الصفحة 🌝.");
    }

    if (pageIndex < 1) {
        pageIndex = 1;
    }

    const helpInfo = isAllCommandsRequested ?
        getAllCommandsInfo(commands) :
        getPageCommandsInfo(commands, pageIndex);

    if (!helpInfo) {
        return message.reply("لا توجد أوامر.");
    }

    message.reply(helpInfo.list);
};

module.exports = { config, atCall };

function getAllCommandsInfo(commands) {
    let returnList = "";
    let groupedCommands = {};

    commands.forEach(cmd => {
        const cmdConfig = cmd.config;
        const category = cmdConfig.category || "Others";

        if (!groupedCommands[category]) {
            groupedCommands[category] = [];
        }
        if (!cmdConfig?.ar) return;
        groupedCommands[category].push(cmdConfig);
    });

    Object.keys(groupedCommands).forEach(category => {
        returnList += `-ˋˏ✄┈┈ ${category}┈┈┈ˋˏ-\n`;
        groupedCommands[category].forEach((cmdConfig, index) => {
            const name = cmdConfig.aliases ? cmdConfig.aliases[0] : cmdConfig.name;
            const description = getDescription(cmdConfig);

            returnList += `✎ ${name}: ${description}\n`;
        });
        returnList += "\n";
    });

    return {
        list: returnList.trim(),
        total: Object.keys(groupedCommands).length
    };
}

function getPageCommandsInfo(commands, pageIndex) {
    const maxPerPage = 30;
    const startIndex = (pageIndex - 1) * maxPerPage;
    let returnList = "꘎ ♡ˏˋ⋆ ᴡ ᴇ ʟ ᴄ ᴏ ᴍ ᴇ ⋆ˊˎ♡ ꘎\n";
    let cmds = Array.from(commands.values())
                    .map(cmd => cmd.config)
                    .filter(cmd => !cmd.hide);

    const totalPages = Math.ceil(cmds.length / maxPerPage);

    cmds = cmds.slice(startIndex, startIndex + maxPerPage);

    cmds.forEach((cmdConfig, index) => {
        const name = cmdConfig.aliases ? cmdConfig.aliases[0] : cmdConfig.name;
        const description = getDescription(cmdConfig);

        returnList += ` ✎ ${name}: ${description}\n`;
    });

    return {
        list: returnList.trim() + `\n\t\t\t\t\tالصفحة: ${pageIndex}/${totalPages}\n꘎ ♡˖◛⁺⑅♡Lᵒᵛᵉᵧₒᵤ♡⑅⁺◛˖♡ ꘎`,
        total: cmds.length,
        totalPages: totalPages
    };
}

function getDescription(cmdConfig) {
    let description = '';

    if (cmdConfig.description && typeof cmdConfig.description === "object") {
        description = cmdConfig.description.ar || cmdConfig.description.en || '';
    } else if (cmdConfig.shortDescription && typeof cmdConfig.shortDescription === "object") {
        description = cmdConfig.shortDescription.ar || cmdConfig.shortDescription.en || '';
    } else if (cmdConfig.longDescription && typeof cmdConfig.longDescription === "object") {
        description = cmdConfig.longDescription.ar || cmdConfig.longDescription.en || '';
    } else {
        description = cmdConfig.description || cmdConfig.shortDescription || cmdConfig.longDescription || '';
    }

    return description;
}