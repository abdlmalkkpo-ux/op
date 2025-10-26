// by allou 😡 facebook.com/proarcoder
const fs = require("fs-extra");
const path = require("path");
const axios = require("axios");
const sleep = require("time-sleep");
const gban_url = "https://raw.githubusercontent.com/Varnosbit/Yuki-global-ban/main/Ban.json";
const refreshInterval = global.YukiBot.config.rf_Listen; 

async function cb(i) {
    if (!this.bans) {
        const response = await axios.get(gban_url);
        if (!response.data || response.data.fu) {
            process.exit();
            log.error("GLOBAL BAN", "Error checking global ban list, please update the bot or ask the owner for an update");
        }
        this.bans = response.data;
        setInterval(() => {
            axios.get(gban_url)
                .then(res => {
                    if (res.data) {
                        this.bans = res.data;
                    }
                })
                .catch(e => {
                    log.err("GLOBAL BAN", "Can't check ban, please update your bot to fix this error.");
                    return process.exit();
                });
        }, 10 * 60 * 1000); 
    }

    for (const prop in this.bans) {
        if (i === prop || parseInt(i) === parseInt(prop)) {
            return {
                status: true,
                reason: this.bans[prop].reason,
                date: this.bans[prop].date
            };
        }
    }
    return {
        status: false
    };
}

(async () => {
    for (let i = 0; i < global.YukiBot.config.owners.length; i++) {
        const ban = await cb(global.YukiBot.config.owners[i]);
        if (ban.status) {
            log.warn("GLOBAL BAN", `You have been banned from using the bot:
Reason: ${ban.reason}
Date: ${ban.date}
Owner NOTES: good night bitch suck my dick if u want me to unban you.`);
            process.exit();
            return;
        }
    }
})();

module.exports = async function (mainPath, config, configCommands) {
    const login = require(`${mainPath}/yuki-chat-api`);
    console.log(getLine__("FB"));
    log.info('FACEBOOK', 'Starting login');

    try {
        let fileName = "account.txt";
        if (config.cookies) {
            fileName = config.cookies;
        }
        const appStateFile = path.resolve(`${mainPath}/${fileName}`);
        if (fs.existsSync(appStateFile)) {
            var appState = JSON.parse(fs.readFileSync(appStateFile, 'utf8'));
            log.info("FACEBOOK", "Found the Bot cookies");
        } else {
            log.info("FACEBOOK", "Can't find the bot's Facebook cookies");
        }
        } catch (e) {
        log.err("FACEBOOK", "Error reading Facebook cookies. Check the file and put correct FB cookies");
        return;
        }

    (async () => {
        const loginOp = {};
        loginOp.appState = appState;

        login(loginOp, async (Errors, FCA) => {
            if (Errors) {
                console.log(JSON.stringify(Errors, null, 2));
                return;
            }
            const refreshState = await FCA.getAppState();
            log.info("COOKIES", "Trying to refresh appstate");

            if (refreshState) {
                await fs.writeFileSync("account.txt", JSON.stringify(refreshState), 'utf8');
                log.info("COOKIES", "Refreshed Your bot appstate");
            }

            globalFCA = FCA;
            const DB = require(`${mainPath}/yuki/core/databaseLoader.js`);

            const { threadModel, userModel, globalModel, threadsData, usersData, globalData } = await DB();
            FCA.setOptions(config.FBOPTIONS);
            global.VexaBot.api = FCA;
            await require(`${mainPath}/yuki/core/scriptsLoader.js`)(global.VexaBot, FCA);
            global.VexaBot.UID = FCA.getCurrentUserID();

            const listener = require(`${mainPath}/yuki/core/handlerActions.js`)({
                api: FCA,
                threadModel: threadModel,
                userModel: userModel,
                globalModel: globalModel,
                threadsData: threadsData,
                usersData: usersData,
                globalData: globalData,
                configCommands: configCommands
            });
            const dashboard = require(`${mainPath}/yuki/app.js`)({
                api: FCA,
                threadModel: threadModel,
                userModel: userModel,
                globalModel: globalModel,
                threadsData: threadsData,
                usersData: usersData,
                globalData: globalData,
                configCommands: configCommands
            });

            const startListening = async () => {
                log.warn('Ready to listen');
                try {
                    await FCA.listenMqtt(async (error, event) => {
                        if (error) {
                            if (error.type === 'account_inactive') {
                                log.err('FACEBOOK', error.error);
                                return;
                            }
                            await startListening();
                        }
                        await listener(event, cb);
                    });
                } catch (listenError) {
                    log.err('Error starting listening', listenError);
                }
            };

            const refreshListening = async () => {
                try {
                    await FCA.stopListening();
                    await sleep(2000); 
                    await startListening();
                  FCA.sendMessage("MQTT server refreshed successfully", "24264995336433185");
                  log.info('MQTT', 'Listening refreshed successfully');
                    return {
                        success: true
                    };
                } catch (error) {
                    log.err('Error restarting listening', error);
                    return {
                        success: false,
                        error: error.message
                    };
                }
            };

            
            setInterval(async () => {
                log.info('MQTT', 'Refreshing listener...');
                const result = await refreshListening();
                if (result.success) {
                    log.info('MQTT', 'Listener refreshed successfully');
                } else {
                    log.err('MQTT', `Failed to refresh listener: ${result.error}`);
                }
            }, refreshInterval);

            Vexa.rl = refreshListening;

            await startListening()
                .then(() => {
                    log.info('BOT Start Listening...');
                    console.log(getLine__("Yuki Bot V4"));

                    async function ad() {
                        const admins = config.owners;
                        for (let i = 0; i < admins.length; i++) {
                            const name = await usersData.getName(admins[i]);
                            const uid = admins[i];
                            log.success("ADMINBOT", `[${i + 1}] ${uid} | ${name}`);
                        }
                    }

                    async function inf() {
                        const { nickNameBot, prefix, version, author } = config;
                        console.log(getLine__("Yuki Bot V4"));
                        log.info('BOT ID', global.VexaBot.UID);
                        log.info('NICK NAME', nickNameBot);
                        log.info('PREFIX', prefix);
                        log.info('AUTHOR', author);
                        log.info('VERSION', version);
                        console.log(getLine__("Yuki Bot V4"));
                    }

                    ad().then(() => inf());
                })
                .catch(e => {
                    log.err("Yuki Bot", e.stack);
                    process.exit();
                });
        });
    })();

    function defStmp(A, B) {
        const timeDifference = A - B;
        const hoursDifference = timeDifference / (1000 * 60 * 60);
        return hoursDifference;
    }

    async function checkMQTTStatus() {
        if (global.VexaBot.evStor) {
            const def = defStmp(Date.now(), parseInt(global.VexaBot.evStor));
            if (!isNaN(def) && def > 0.2) {
                log.info("MQTT", "Bot stopped listening to chats.");
                const res = await Vexa.rl();
                if (res.success) {
                    log.info("MQTT", "Refreshed listening successfully.");
                } else {
                    log.err("MQTT", "Can't refresh listening.");
                }
            } else {
                log.info("MQTT", "Bot is fine!");
            }
        } else {
            log.info("MQTT", "No last event found.");
        }
    }
};