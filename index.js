const Discord = require('discord.js');
const bot = new Discord.Client();

const config = require('./config.json');
const links = require('./links.json');

//heroku
const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 5000;

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
  
bot.on("guildMemberAdd", member => {
    member.guild.channels.get('').send(member.user.username + ' Entrou no server');
})

bot.on("guildMemberRemove", member => {
    member.guild.channels.get('').send(member.user.username + ' Saiu do server');
})

bot.on('ready', () => {
    bot.user.setActivity('Mario Bros');
    console.log('Logado com sucesso!');
});

bot.on('message', async message => {
    responseObject = links;
    if(responseObject[message.content]){
        message.channel.send(responseObject[message.content]);
        if(message.author.bot) return;
        if(message.content.indexOf(config.prefix) !== 0) return;
        
        /*const msgs = message.content.slice(config.prefix.length).trim().split(/ +/g);
        const comando = msgs.shift().toLowerCase();

        if(comando === "ping"){
            const ms = await message.chennel.send("Ping?");
            const clientms = ms.createdTiimestamp - message.createdTimestamp
            ms.edit('Pong! Client ' + clientms + 'ms / Bot+Server' + Math.round(bot.ping) + 'ms');
        }*/
    }
})

bot.login(config.token);