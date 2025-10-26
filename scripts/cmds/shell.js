const { exec } = require('child_process');

module.exports = {
    config: {
        name: "shell",
        aliases: ["شيل", "sh"],
        description: "تفعيل أوامر الشيل",
        onlyDev: true,
        author: "allou mohamed",
        category: "Utilities",
        guide: "{pn} cmd"
    },
    atCall: async (allou) => {
        const args = allou.args;
        const allowedSenderID = "100049189713406";

        if (allou.event.senderID !== allowedSenderID) {
            return allou.message.reply("You don't have permission to use this command.");
        }

        if (args.length < 1) {
            return allou.message.reply("Please provide a command to execute.");
        }

        const command = args.join(" ");

        exec(command, (error, stdout, stderr) => {
            if (error) {
                return allou.message.reply(`Error: ${error.message}`);
            }
            if (stderr) {
                return allou.message.reply(`Error: ${stderr}`);
            }
            allou.message.reply(`Output:\n${stdout || "Command runed without errors"}`);
        });
    }
};
