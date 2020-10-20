import Discord, { Channel, Client, Emoji } from 'discord.js';
import ytdl from 'ytdl-core-discord';

import express, {Request, Response} from 'express';
import bodyParser from 'body-parser';

import * as dotenv from 'dotenv';
dotenv.config();

import { isEmpty } from 'lodash';

import { Video, YouTube } from 'popyt';

const PORT = process.env.PORT || undefined;



const __main__ = () =>
{
    const app: Client = new Client();
    const youtube: YouTube = new YouTube(process.env.YOUTUBE_TOKEN);

    let song_choose = false;
    let song_pause = false;
    let vids: Video[];
    let playlist: Video[] = [];
    let connection: Discord.VoiceConnection;
    let channel: Discord.VoiceChannel;

    app.login(process.env.DISCORD_TOKEN);
    
    app.on('ready', () =>
    {
        console.log(`${app.user.username} is ready`);
    });

    app.on('message', async (message) =>
    {
        if (message.author.bot) return;
        if (! message.content.startsWith(process.env.PREFIX)) return;

        const data = message.content.trim().substring(1).toLowerCase();

        if (data.startsWith(process.env.COMMAND_PLAY))
        {
            channel = message.member.voice.channel;

            await message.react(process.env.OK_SYMBOL);

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
                    song_choose = true;
                    await message.channel.send(title_list);

                }
            }
            else
            {
                await message.channel.send(`Use ${process.env.PREFIX + process.env.COMMAND_PLAY} + <song name> to play a song`);
            }
        }
        else if (song_choose)
        {
            song_choose = false;
            if ("1" <= data && data <= process.env.NUMBER_OF_YOUTUBE_VIDS)
            {
                const url = `https://youtube.com/watch?v=${vids[parseInt(data) - 1].id}`;

                await message.react(process.env.OK_SYMBOL);

                playlist.push(await youtube.getVideo(url));

                connection.play(
                await ytdl(url),
                {
                    type: 'opus'
                })
                .on("finished", () =>
                {
                    message.channel.send("Nothing else to play, imma head out");
                    channel.leave();
                })
                .on("error", (err : Error) =>
                {
                    message.channel.send("Something bad happened, please try again.");
                    console.log(err);
                });

                await message.channel.send(`Now playing ${vids[parseInt(data) - 1].title}}...`);
            }
            else
            {
                await message.react(process.env.THINK_SYMBOL);
                await message.channel.send(`Bro ???`);
            }
        }
        else
        {
            if (data.startsWith(process.env.COMMAND_STOP))
            {
                await message.react(process.env.SAD_SYMBOL);
                connection.dispatcher.end();
                channel.leave();
            }
            else if (data.startsWith(process.env.COMMAND_PAUSE))
            {
                await message.react(process.env.OK_SYMBOL);
                connection.dispatcher.pause(true);
                song_pause = true;
            }
            else if (data.startsWith(process.env.COMMAND_RESUME))
            {
                if (song_pause)
                {
                    await message.react(process.env.OK_SYMBOL);
                    connection.dispatcher.resume();
                }
                else
                {
                    await message.react(process.env.THINK_SYMBOL);
                    await message.channel.send(`Bro ???`);
                }
            }
        }
    });

    app.on('error', () =>
    {
        console.log("Error!\nError!\nError!");
    });
}

const __express__ = () =>
{
    const app = express();

    app.use(bodyParser.json());
    app.use(express.urlencoded({ extended: false}));

    app.get("/", (req: Request, res: Response) =>
    {
        res.send("This is a non-coding discord bot.");
    });

    app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
}

__main__();
if (PORT)
{
    __express__();
}