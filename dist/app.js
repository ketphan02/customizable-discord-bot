"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const ytdl_core_discord_1 = __importDefault(require("ytdl-core-discord"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const lodash_1 = require("lodash");
const popyt_1 = require("popyt");
const __main__ = () => {
    const app = new discord_js_1.Client();
    const youtube = new popyt_1.YouTube(process.env.YOUTUBE_TOKEN);
    let song_choose = false;
    let song_pause = false;
    let vids;
    let playlist = [];
    let connection;
    let channel;
    app.login(process.env.DISCORD_TOKEN);
    app.on('ready', () => {
        console.log(`${app.user.username} is ready`);
    });
    app.on('message', async (message) => {
        if (!message.author.bot && message.content.startsWith(process.env.PREFIX)) {
            const data = message.content.trim().substring(1).toLowerCase();
            if (data.startsWith(process.env.COMMAND_PLAY)) {
                channel = message.member.voice.channel;
                await message.react(process.env.OK_SYMBOL);
                // Check if user in voice channel or bot have enough permission to play music
                if (!channel) {
                    await message.channel.send("You need to be in voice channel to play music.");
                    return;
                }
                if (!channel.permissionsFor(message.client.user).has("CONNECT")) {
                    await message.channel.send("I don\'t have permission to join the voice channel");
                    return;
                }
                if (!channel.permissionsFor(message.client.user).has("SPEAK")) {
                    await message.channel.send("I don\'t have permission to speak in the voice channel");
                    return;
                }
                connection = await channel.join();
                const query = data.substring((process.env.PREFIX + process.env.COMMAND_PLAY).length + 1);
                if (!lodash_1.isEmpty(query)) {
                    vids = (await youtube.searchVideos(query, parseInt(process.env.NUMBER_OF_YOUTUBE_VIDS))).results;
                    if (lodash_1.isEmpty(vids)) {
                        await message.channel.send("No video found, please try again");
                    }
                    else {
                        let title_list = "Which one ?\n";
                        vids.forEach((vid, id) => {
                            title_list += (id + 1) + '. ' + vid.title + '\n';
                        });
                        song_choose = true;
                        await message.channel.send(title_list);
                    }
                }
                else {
                    await message.channel.send(`Use ${process.env.PREFIX + process.env.COMMAND_PLAY} + <song name> to play a song`);
                }
            }
            else if (song_choose) {
                song_choose = false;
                if ("1" <= data && data <= process.env.NUMBER_OF_YOUTUBE_VIDS) {
                    try {
                        const url = `https://youtube.com/watch?v=${vids[parseInt(data) - 1].id}`;
                        await message.react(process.env.OK_SYMBOL);
                        playlist.push(await youtube.getVideo(url));
                        connection.play(await ytdl_core_discord_1.default(url), { type: 'opus' });
                        await message.channel.send(`Now playing ${vids[parseInt(data) - 1].title}}...`);
                    }
                    catch {
                        await message.channel.send("Something bad happened, please try again.");
                    }
                }
                else {
                    await message.react(process.env.THINK_SYMBOL);
                    await message.channel.send(`Bro ???`);
                }
            }
            else {
                if (data.startsWith(process.env.COMMAND_STOP)) {
                    await message.react(process.env.SAD_SYMBOL);
                    connection.dispatcher.end();
                    channel.leave();
                }
                else if (data.startsWith(process.env.COMMAND_PAUSE)) {
                    await message.react(process.env.OK_SYMBOL);
                    connection.dispatcher.pause(true);
                    song_pause = true;
                }
                else if (data.startsWith(process.env.COMMAND_RESUME)) {
                    if (song_pause) {
                        await message.react(process.env.OK_SYMBOL);
                        connection.dispatcher.resume();
                    }
                    else {
                        await message.react(process.env.THINK_SYMBOL);
                        await message.channel.send(`Bro ???`);
                    }
                }
            }
            console.log(song_choose);
        }
    });
    app.on('error', () => {
        console.log("Error!\nError!\nError!");
    });
};
__main__();
//# sourceMappingURL=app.js.map