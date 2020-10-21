# Discord Music Bot Template

## What are the files in this folder
- Logic file
    - src/app.ts ⟶ Our main file.
- Configurate files
    - package.json ⟶ For all the depedencies and project information.
    - tsconfig, tslint ⟶ Config for TypeScript.
    - Procfile ⟶ Set the command for Heroku hosting.
- Info file
    - README<span>.</span>md ⟶ This file, which let people understand what is in this project.

## Deploy
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/ketphan02/customizable-discord-bot)

## Environment variables
    Note that all the variable must be assigned in Config Vars under Settings tab in Heroku.
| Variable name | Example Value |
| ------------- | ------------- |
| APP_NAME | discord-music-bot-eg |
| DISCORD_TOKEN |  |
| COMMAND_PLAY | play |
| COMMAND_PAUSE | pause |
| COMMAND_RESUME | resume |
| COMMAND_STOP | stop |
| NUMBER_OF_YOUTUBE_VIDS | 4 |
| PREFIX | ! |
| OK_SYMBOL | 👌 |
| SAD_SYMBOL | 😢 |
| THINK_SYMBOL | 🤔 |

You can customize these values by your preference. For this set of variable, we will have the following commands:<br/>
    - Play command:
    ``` !play SONG-NAME ``` (This will return some songs for you to choose and you can use ``!index-of-the-song-you-want`` to select). <br/>


