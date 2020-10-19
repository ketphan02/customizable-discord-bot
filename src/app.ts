import Discord, { Client } from 'discord.js';

import * as dotenv from 'dotenv';
dotenv.config();

const __main__ = () =>
{
    const app: Client = new Client();

    app.login(process.env.DISCORD_TOKEN);
    
    app.on('ready', () =>
    {
        console.log(`${app.user.username} is ready`);
    });

    app.on('message', async (message) =>
    {
        if (message.content.startsWith(process.env.PREFIX))
        {
            const data = message.content;
            if (data.startsWith(process.env.PREFIX + process.env.COMMAND_PLAY))
            {
                message.channel.send("You wanted me to play some music");
            }
        }
    });

    app.on('error', () =>
    {
        console.log("Error!\nError!\nError!");
    });
}

__main__();