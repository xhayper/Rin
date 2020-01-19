# Rin
A Fun Music Bot Made In discord.js

# Feature
* Play Music
* Play Live Music

# Bot Information
Discord Framework : discord.js<br>
Hosted On : [Glitch](https://glitch.com)<br>
Invite link : [Here](https://discordapp.com/oauth2/authorize?client_id=667632306457935873&scope=bot&permissions=11889985)<br>
Support Server Link : [Here](https://discord.gg/KM9X35B)

# Power Levels

|Name     | Power Level | Permissions | Default? |
|:--------|:-----------:|:------------|:--------:|
|All      |0            |Anything     |Yes       |
|Admin    |2            |Administrator|No        |
|Bot Owner|4            |Bot Owner    |No        |

# Command List

* [] = Required, () = Optinal, / = or, & = and.

#### Category

##### Information

|Command Name |Power Level|Argument |Description                        |Example |
|:-----------:|:---------:|:-------:|:----------------------------------|:-------|
|rin$help     |0          |None     |Show you all of the commands       |rin$help|                
|rin$info     |0          |None     |Show you the information of the bot|rin$info|

###### Music

|Command Name |Power Level|Argument                                            |Description                     |Example                                                                                                                        |
|:-----------:|:---------:|:--------------------------------------------------:|:-------------------------------|:------------------------------------------------------------------------------------------------------------------------------|
|rin$play     |0          |[Youtube Video URL/Youtube Video ID/ Search String] |Play/Add a video to the queue.  |rin$play https://www.youtube.com/watch?v=dQw4w9WgXcQ<br>rin$play dQw4w9WgXcQ<br>rin$play Rick Astley - Never Gonna Give You Up |
|rin$skip     |0          |None                                                |Skip a song                     |rin$skip                                                                                                                       |
|rin$stop     |0          |None                                                |Stop the song. (Clear the queue)|rin$stop                                                                                                                       |
|rin$queue    |0          |None                                                |See the current queue           |rin$queue                                                                                                                      |

# Packages
[bufferutil](https://www.npmjs.com/package/bufferutil)<br>
[discord.js](https://www.npmjs.com/package/discord.js)<br>
[dotenv](https://www.npmjs.com/package/dotenv)<br>
[glob](https://www.npmjs.com/package/glob)<br>
[libsodium-wrappers](https://www.npmjs.com/package/libsodium-wrappers)<br>
[node-opus](https://www.npmjs.com/package/node-opus)<br>
[ytdl-core](https://www.npmjs.com/package/ytdl-core)<br>
[yt-search](https://www.npmjs.com/package/yt-search)<br>
[@isolution/youtube-audio-stream](https://www.npmjs.com/package/@isolution/youtube-audio-stream)<br>
[moment](https://momentjs.com/)<br>
hammerandchisel/erlpack<br>

# How to host?

* Download the source, Unzip it in your desktop
* Then rename config.json.example to config.json and edit the file data
* Do the same with .env.example
* Open Command Prompt, Then type ```cd "C:\Users\%username%\Desktop\Rin-rin-master"``` or change directory to the bot folder.
* Then type ```npm install``` (Only do it once)`
* Then type ```node main.js```

# FAQ
* Help! It said `'npm' is not recognized as an internal or external command.` or `'node' is not recognized as an internal or external command.`<br>
A : Install [Node.JS](https://nodejs.org/en/).

* Help! It said `Error : Cannot find module 'node-gyp'`<br>
A : Install [node-gyp](https://github.com/nodejs/node-gyp) and [windows-build-tools](https://www.npmjs.com/package/windows-build-tools).

* Help! It said `Error : Invalid converter command`<br>
A : Install [FFMPEG](https://www.ffmpeg.org/download.html), Then put the file path in PATH in System Enviroment Variablem, Then restart.