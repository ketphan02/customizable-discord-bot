import Discord, { Client } from 'discord.js';
import ytdl from 'ytdl-core-discord';

import * as dotenv from 'dotenv';
dotenv.config();

import { isEmpty } from 'lodash';

import { Video, YouTube } from 'popyt';

const __main__ = () =>
{
    const app: Client = new Client();
    const youtube: YouTube = new YouTube(process.env.YOUTUBE_TOKEN);

    let curStep = 0;
    let vids: Video[];
    let playlist: Video[] = [];
    let connection: Discord.VoiceConnection;

    app.login(process.env.DISCORD_TOKEN);
    
    app.on('ready', () =>
    {
        console.log(`${app.user.username} is ready`);
    });

    app.on('message', async (message) =>
    {
        if (!message.author.bot && message.content.startsWith(process.env.PREFIX))
        {
            const data = message.content.trim().substring(1);

            if (curStep === 0)
            {
                if (data.startsWith(process.env.COMMAND_PLAY))
                {
                    const channel = message.member.voice.channel;

                    // Check if user in voice channel or bot have enough permission to play music
                    if (!channel)
                    {
                        await message.channel.send("You need to be in voice channel to play music.");
                        return;
                    }
                    if (!channel.permissionsFor(message.client.user).has("CONNECT"))
                    {
                        await message.channel.send("I don\'t have permission to join the voice channel");
                        return;
                    }
                    if (!channel.permissionsFor(message.client.user).has("SPEAK"))
                    {
                        await message.channel.send("I don\'t have permission to speak in the voice channel");
                        return;
                    }

                    connection = await channel.join();
                    console.log(connection);
                    

                    const query = data.substring((process.env.PREFIX + process.env.COMMAND_PLAY).length + 1);

                    if (!isEmpty(query))
                    {
                        vids = (await youtube.searchVideos(query,  parseInt(process.env.NUMBER_OF_YOUTUBE_VIDS))).results;

                        if (isEmpty(vids))
                        {
                            await message.channel.send("No video found, please try again");
                        }
                        else
                        {
                            let title_list = "Which one ?\n";
                            vids.forEach((vid, id) =>
                            {
                                title_list += (id + 1) + '. ' + vid.title + '\n';
                            });
                            ++ curStep;
                            await message.channel.send(title_list);

                        }
                    }
                    else
                    {
                        await message.channel.send(`Use ${process.env.PREFIX + process.env.COMMAND_PLAY} + <song name> to play a song`);
                    }
                }
            }
            else if (curStep === 1)
            {
                if ("1" <= data && data <= process.env.NUMBER_OF_YOUTUBE_VIDS)
                {
                    ++ curStep;
                    const url = `https://youtube.com/watch?v=${vids[parseInt(data) - 1].id}`;

                    playlist.push(await youtube.getVideo(url));

                    connection.play(await ytdl(url), {type: 'opus'});
                }
                else curStep = 0;
            }
            else curStep = 0;

            console.log(curStep);
        }
    });

    app.on('error', () =>
    {
        console.log("Error!\nError!\nError!");
    });
}

__main__();