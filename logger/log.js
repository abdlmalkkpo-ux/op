const moment = require("moment-timezone");
const characters = '';

const getCurrentTime = () =>
	moment().tz("Africa/Algiers").format("HH:mm:ss DD/MM/YYYY");

function logError(prefix, message) {
	if (message === undefined) {
		message = prefix;
		prefix = "ERROR";
	}
	console.log(`${getCurrentTime()} [${prefix}]`, message);

	const error = Object.values(arguments).slice(2);
	for (let err of error) {
		if (typeof err == "object" && !err.stack)
			err = JSON.stringify(err, null, 2);
		console.log(`${getCurrentTime()} [${prefix}]`, err);
	}
}

module.exports = {
	err: logError,
	error: logError,
	warn: function (prefix, message) {
		if (message === undefined) {
			message = prefix;
			prefix = "WARN";
		}
		console.log(`${getCurrentTime()} [${prefix}]`, message);
	},
	info: function (prefix, message) {
		if (message === undefined) {
			message = prefix;
			prefix = "INFO";
		}
		console.log(`${getCurrentTime()} [${prefix}]`, message);
	},
	success: function (prefix, message) {
		if (message === undefined) {
			message = prefix;
			prefix = "SUCCESS";
		}
		console.log(`${getCurrentTime()} [${prefix}]`, message);
	},
	master: function (prefix, message) {
		if (message === undefined) {
			message = prefix;
			prefix = "MASTER";
		}
		console.log(`${getCurrentTime()} [${prefix}]`, message);
	},
	dev: (...args) => {
		if (!["development", "production"].includes(process.env.NODE_ENV))
			return;
		try {
			throw new Error();
		} catch (err) {
			const at = err.stack.split('\n')[2];
			let position = at.slice(at.indexOf(process.cwd()) + process.cwd().length + 1);
			if (position.endsWith(')')) position = position.slice(0, -1);
			console.log(`${position} =>`, ...args);
		}
	}
};
