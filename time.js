const discord = require("discord.js");
const bot = new discord.Client();
const fs = require("fs");
const token = JSON.parse(fs.readFileSync("./bottoken.json"));

var channelJson = fs.readFileSync("./channels.json");
var jsonData = JSON.parse (channelJson);
var interval;

bot.login(token.token);

bot.on("ready",() =>{
    console.log("UTC Time Bot online");
    interval = setInterval(function(){checkTime(jsonData);},10000);
});

bot.on('error',(err) => {
    console.log("bot error: " + err.message);
});

bot.on("message",(message)=>{
    if(message.content == "~~utc") {
        message.channel.send("adding channels in all servers...");
        var count = addChannels();
        message.channel.send("found " + count + " new channel(s)");
        message.channel.send("resuming bot...");
    }
});

function addChannels(){
    var count = 0;
    bot.guilds.forEach((thisguild)=>{
        thisguild.channels.forEach((thisch)=>{
            if(thisch.name == "utctimebot"){
                if(!jsonData.includes(thisch.id)){
                    jsonData.push(thisch.id);
                    count++;
                }
            }
        });
    });
    fs.writeFileSync("./channels.json",JSON.stringify(jsonData),null,4);
    clearInterval(interval);
    interval = setInterval(function(){checkTime(jsonData);},10000);
    return count;
}

function checkTime(jsonData){
    var date = new Date();
    var hours = date.getUTCHours();
    var minutes = date.getUTCMinutes();
    if (hours < 10) hours = "0" + hours;
    if (minutes < 10) minutes = "0" + minutes;
    var time = hours + ":" + minutes + " (UTC)";
    console.log(time);
    bot.guilds.forEach((thisguild)=>{
        thisguild.channels.forEach((thisch)=>{
            if(jsonData.includes(thisch.id)){
                thisch.setName("🕑 " + time);
            }
        });
    });
}
