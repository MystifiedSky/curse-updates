import { Snowflake } from "discord.js";

export interface JSONConfig {
    token: string;
}

export interface ServerConfig {
    serverId: Snowflake
    prefix: string;
    releasesChannel: Snowflake;
    messageTemplate: string;
    projectIds: Array<number>;
}

export interface CachedProject {
    id: number;
    slug: string;
    version: string;
}