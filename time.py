import discord
import asyncio
import json
import datetime

with open("./bottoken.json") as token_file:
    token  = json.load(token_file)
settingTime = False
with open('./channels.json') as json_file:
    json_channels = json.load(json_file)

async def set_time(client):
    while True:
        time = datetime.datetime.utcnow()
        for channel in client.get_all_channels():
            if channel.id in json_channels:
                hours = str(time.hour)
                minutes = str(time.minute)
                if (len(hours) == 1): hours = "0" + hours
                if (len(minutes) == 1): minutes = "0" + minutes
                time_str = hours + ":" + minutes + " (UTC)"
                print("Time is: " + time_str)
                await channel.edit(name="🕐" + time_str)
                print("Time set!")
        await asyncio.sleep(30)

class Client(discord.Client):
    async def on_ready(self):
        print("UTCTime bot is online")

    async def on_message(self,message):
        if message.content == "~~utc":
            await message.channel.send("adding channels in all servers...")
            count = await self.add_channels()
            await message.channel.send("found " + str(count) + " new channel(s)")
            await message.channel.send("resuming bot...")
        
    async def add_channels(self):
        count = 0
        for channel in client.get_all_channels():
            if channel.name == 'utctimebot':
                if channel.id not in json_channels:
                    json_channels.append(channel.id)
                    count += 1
        with open('./channels.json','w') as json_file:
            json.dump(json_channels,json_file)
        return count
            


client = Client()
client.loop.create_task(set_time(client))
client.run(token)