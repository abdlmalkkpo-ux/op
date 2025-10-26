module.exports = async (YukiBot, FCA) => {
	const { configCommands, mainPath, dirConfigCommands } = global.YukiBot;
	const { readdirSync, readFileSync, writeFileSync } = require("fs-extra");
    console.log(getLine__("CE"));
	const folder = ["cmds", "events"];

	for (const folderModules of folder) {
		const commandError = [];
		let text = "", typeEnvCommand = "", setMap = "";
		if (folderModules == "cmds") {
			text = "command";
			typeEnvCommand = "envCommands";
			setMap = "commands";
		}
		else {
			text = "command event";
			typeEnvCommand = "envEvents";
			setMap = "events";
		}
		const Files = readdirSync(mainPath + "/scripts/" + folderModules).filter((item) => item.endsWith(".js") && !configCommands?.unloaded?.[setMap]?.includes(item));

		for (const file of Files) {
			try {
				const pathCommand = mainPath + `/scripts/${folderModules}/${file}`;
				const command = require(pathCommand);
				const configCommand = command.config;
				// ——————————————— CHECK SYNTAXERROR ——————————————— //
				if (!configCommand) throw new Error("Config of command undefined");
				if (!configCommand.name) throw new Error(`The command without name`);
				const commandName = configCommand.name;
				if (global.YukiBot[setMap].has(commandName)) throw new Error("This command already exist.");
				// ——————————————— CHECK SHORT NAME ———————————————— //
				if (configCommand.aliases) {
					let { aliases } = configCommand;
					if (typeof aliases == "string") aliases = [aliases];
					for (const aliases_ of aliases) {
						if (global.YukiBot.aliases.has(aliases_)) throw new Error(`Aliase ${aliases_} already exist ${global.YukiBot.aliases.get(aliases_)}`);
						else global.YukiBot.aliases.set(aliases_, configCommand.name);
					}
				}
				// ——————————————— CHECK ENV GLOBAL ——————————————— //
				if (configCommand.envGlobal) {
					const { envGlobal } = configCommand;
					if (typeof envGlobal != "object" && Array.isArray(envGlobal)) throw new Error("envGlobal need to be a object");
					if (!configCommands.envGlobal) configCommands.envGlobal = {};
					for (const i in envGlobal) {
						if (!configCommands.envGlobal[i]) {
configCommands.envGlobal[i] = envGlobal[i];
							writeFileSync(dirConfigCommands, JSON.stringify(configCommands, null, 2));
						} else {
							let readCommand = readFileSync(pathCommand).toString();
							readCommand = readCommand.replace(envGlobal[i], configCommands.envGlobal[i]);
	             writeFileSync(pathCommand, readCommand);
						}
					}
				}
				// ———————————————— CHECK CONFIG CMD ——————————————— //
				if (configCommand.envConfig && typeof configCommand.envConfig == "object") {
					
					if (!configCommands[typeEnvCommand]) configCommands[typeEnvCommand] = {};
					if (!configCommands[typeEnvCommand][commandName]) configCommands[typeEnvCommand][commandName] = {};

					for (const [key, value] of Object.entries(configCommand.envConfig)) {
					
						if (!configCommands[typeEnvCommand][commandName][key]) {
configCommands[typeEnvCommand][commandName][key] = value;
					writeFileSync(dirConfigCommands, JSON.stringify(configCommands, null, 2));
					} else {
							let readCommand = readFileSync(pathCommand).toString();
							readCommand = readCommand.replace(value, configCommands[typeEnvCommand][commandName][key]);
	             writeFileSync(pathCommand, readCommand);
						}
					}
				}
				// ——————————————— CHECK RUN ANYTIME ——————————————— //
				if (command.atChat || command.onChat) global.YukiBot.atChat.push(commandName);
				if (command.onEvent || command.atEvent) global.YukiBot.atEvent.set(command.config.name, command);
				if (command.onLoad) {
					command.onLoad({api: FCA});
				}
				// ————————————— IMPORT TO global.YukiBot ————————————— //
				global.YukiBot[setMap].set(commandName.toLowerCase(), command);
			}
			catch (error) {
				log.error(`${`[ ${text.toUpperCase()} ]`} ${file} failed: ${error.message}\n`);
				commandError.push({ name: file, error });
			}
		}
		if (commandError.length > 0) {
			log.err(`Errors ${text}`);
			for (const item of commandError) log.err(`${item.name}: ${item.error.stack}`);
		}
	}
		log.info(`Loaded ${global.YukiBot.commands.size} command and ${global.YukiBot.events.size} event.`);
};