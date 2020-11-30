import { Client, EmbedFieldData, MessageEmbed, Snowflake } from "discord.js";
import { CurseHelper } from "./curseHelper";
import { CacheHandler, GuildHandler } from "./data/dataHandler";
import { commands } from "./main";
import { ReleaseType, releaseTypes } from "./model/ModData";
import { Utils } from "./utils";


const embedColors = [
	0x404040,
	0xFEBC11,
	0xF26122,
];

export function buildHelpEmbed(title: string, category: string): MessageEmbed {
    const embed = new MessageEmbed();
    embed.setTitle(title);

    commands.forEach(command => {
        if (command.category === category) {
            embed.addField(command.name, command.description);
        }
    });

    if (embed.fields === []) {
        embed.setDescription("No commands found for specificed category.\nTip: write `help` without any category to get a list of general commands")
    }

    // Set a Random Embed Color
    embed.setColor(embedColors[Math.ceil((Math.random() * 3))]);
    return embed;
}

export async function buildModEmbed(modId: number): Promise<MessageEmbed> {

    const projectData = await CurseHelper.queryModById(modId);
    const mod = projectData.mod;
    const modFile = projectData.latestFile;

    const modEmbed = new MessageEmbed();
    const releaseType: ReleaseType = releaseTypes[modFile.release_type as unknown as number];
    Utils.getFilenameFromURL(modFile.download_url);
    let authorString = '';

    for (let i = 0; i < mod.authors.length; i++) {
        const author = mod.authors[i];
        authorString += '[' + author.name + '](' + author.url + '), ';
    }

    modEmbed.type = 'rich';
    modEmbed.setTitle('New ' + mod.name + ' ' + releaseType.name + '!').setURL(mod.url);
    modEmbed.setDescription(mod.summary);
    modEmbed.addField('Authors', authorString);
    modEmbed.setColor(releaseType.color);
    modEmbed.setThumbnail(mod.logo.url);
    modEmbed.addField('Minecraft Versions', modFile.minecraft_versions.join(', '));
    modEmbed.addField('New Mod Version', fileName);
    modEmbed.addField('Type', releaseType.name);
    modEmbed.addField('Links', '[Download](' + modFile.download_url.replace(/ /g, '%20') + ')\n[CurseForge](' + mod.url + ')');
    modEmbed.setTimestamp(modFile.timestamp);

    console.log('Latest file: ' + fileName);

    return modEmbed;
}

export async function buildScheduleEmbed(guildId: Snowflake, client: Client): Promise<MessageEmbed> {
    const idNamePairs: EmbedFieldData[] = [];

    const config = GuildHandler.getServerConfig(guildId);

    config.projectIds.forEach(id => {
        const project = CacheHandler.getProjectById(id);
        idNamePairs.push({name: project.id, value: project.id});
    });

    const embed = new MessageEmbed();
    embed.color = embedColors[Math.ceil((Math.random() * 3))];
    embed.setTitle('Registered Projects and Release Channel for this server');

    const releasesChannelId = config.serverConfig[guildId].releasesChannel;

    let channel = null;
    if (releasesChannelId != '-1') {
        channel = await client.channels.fetch(releasesChannelId);
    }

    if (channel !== null) {
        embed.addField('Announcements Channel', channel.toString());
    }
    else {
        embed.addField('Announcements Channel', 'None');
    }

    const messageTemplate = config.serverConfig[guildId].messageTemplate;
    if (messageTemplate !== '') {
        embed.addField('Template Message', messageTemplate);
    }
    else {
        embed.addField('Template Messsage', 'None');
    }

    if (idNamePairs.length > 0) {
        embed.addFields(idNamePairs);
    }
    else {
        embed.setTitle('No Projects have been Scheduled on this server');
    }

    return embed;
}