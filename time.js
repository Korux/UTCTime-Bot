/*

** HOW TO USE **
NAME A VOICE CHANNEL "utctimebot"
USE THE "~~utc" COMMAND


*/

const discord = require("discord.js");
const bot = new discord.Client();
const fs = require("fs");
const token = JSON.parse(fs.readFileSync("./bottoken.json"));

var channelJson = fs.readFileSync("./channels.json");
var jsonData = JSON.parse (channelJson);
var interval;
var settingTime;

bot.login(token.token);

bot.on("ready",() =>{
    console.log("UTC Time Bot online");
	settingTime = false;
    interval = setInterval(function(){checkTime(jsonData);},180000);
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
    bot.guilds.cache.forEach((thisguild)=>{
        thisguild.channels.cache.forEach((thisch)=>{
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
    interval = setInterval(function(){checkTime(jsonData);},180000);
    return count;
}

function checkTime(jsonData){
    var date = new Date();
    var hours = date.getUTCHours();
    var minutes = date.getUTCMinutes();
    if (hours < 10) hours = "0" + hours;
    if (minutes < 10) minutes = "0" + minutes;
    var time = hours + ":" + minutes + " (UTC)";
	console.log("time is: ", time);
	if(settingTime == false){
		settingTime = true;
		bot.guilds.cache.forEach((thisguild)=>{
        thisguild.channels.cache.forEach((thisch)=>{
            if(jsonData.includes(thisch.id)){
				console.log("setting time...");
				thisch.setName("🕑 " + time).then(ch=>{
                    console.log("promise fulfilled: "+time + " channel: " + ch);
					settingTime = false;
                }).catch(err=>{console.log(err)});
            }
        });
    });
	}
}
