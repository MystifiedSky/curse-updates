import { Message } from "discord.js";
import { GuildInitializer } from "../../data/dataHandler";
import Command from "../../model/Command";
import { Permission } from "../../utils";

async function run(args: string[], messageRef: Message) {
    if (args[0] == undefined)
        return "Need ID arg"
    const guild = await messageRef.client.guilds.fetch(args[0]);
    GuildInitializer.initServerConfig(guild.id, guild.name);
    //const invite = (await guild.fetchInvites()).first();
    //Utils.sendDMtoOwner(messageRef.client, invite.url)
    return `Initializing ${guild.name} Data Package`;
}

export const comm: Command = new Command(
    'test', 
    {
        description: 'does hacky tests [it actually does nothing except testing some functions] - Internal Command only runnable by the bot author',
        isGuild: false,
        action: run,
        permLevel: Permission.OWNER,
        argNames: ['id'],
        async: true
    }
);