import * as fs from 'fs';
import { logger } from './main';

async function loadCommands() {
	const commands = [];

	fs.readdir('./build/commands/util', (error, files) => {
		if (error)
			logger.error("commandLoaderError: " + error);
		files = files.filter(file => !file.endsWith('map'));
		logger.info("Loading " + files.length + " util commands");
		files.forEach(async file => {
			const command = await import("./commands/util/" + file);
			// logger.info(command.comm);
			commands.push(command.comm);
		});
	});
	
	fs.readdir('./build/commands/schedule', (error, files) => {
		if (error)
			logger.error("commandLoaderError: " + error);
		files = files.filter(file => !file.endsWith('map'));
		logger.info("Loading " + files.length + " scheduling commands");
		files.forEach(async file => {
			const command = await import('./commands/schedule/' + file);
			// logger.info(command.comm);
			commands.push(command.comm);
		});
	});

	return commands;
}

exports.loadCommands = loadCommands;