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
 
bot.on("guildCreate", guild => {
    console.log('O bot entrou no servidor: ${guild.name} (id: ${guild.id}). População: ${guild.memberCount} membros!');
    client.user.setActivity('Estou em ${client.guilds.size servidor(es)');
});

bot.on("guildDelete", guild => {
    console.log(`O bot foi removido do servidor: ${guild.name} (id: ${guild.id})`);
    bot.user.setActivity(`Estou em ${bot.guilds.size} servidor(es)`);
  });
  

//comando membro saiu
bot.on("guildMemberAdd", member => {
    member.guild.channels.get('498158780140486659').send(member.user.username + ' Entrou no servidor, seja bem vindo. Não esqueça de ler nossas regras digitando !regras.');
});

//comando novo membro
bot.on("guildMemberRemove", member => {
    member.guild.channels.get('498158780140486659').send(member.user.username + ' Desconectou-se do servidor');
});

bot.on('ready', () => {
    let counting = 0;
    setInterval(function() {
        /*bot.user.setActivity('Top Gear 3000');*/
        console.log('Contando ' + counting);
        counting++;
    }, 60000);
    console.log(`Bot foi iniciado, com ${bot.users.size} usuários, em ${bot.channels.size} canais, em ${bot.guilds.size} servido(res).`); 
    bot.user.setActivity(`Eu estou em ${bot.guilds.size} servidor(es)`);
});

bot.on('message', async message => {
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;
    if(message.content.indexOf(config.prefix) !== 0) return;

        
    const msgs = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const comando = msgs.shift().toLowerCase();

    //comando ping
    if(comando === "ping"){
        const ms = await  message.channel.send("Ping?");
        const clientms = ms.createdTimestamp - message.createdTimestamp;
        ms.edit('`\`\`\`**Pong! Client **' + clientms + 'ms / **Bot+Server** ' + Math.round(bot.ping) + 'ms`\`\`\`');
    }

     //comando falar
     if(comando === "say") { 
         const sayMessage = msgs.join(" ");
         message.delete().catch(O_o=>{});  
         message.channel.send(sayMessage);
  }

  //comando apagar
  if(comando === "clear") {
      if(!message.member.roles.some(r=>["Admin", "Moderador"].includes(r.name)) )
      return message.reply("Desculpe, você não tem permissão para usar isto!");
      const deleteCount = parseInt(msgs[0], 10);
      if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("Por favor, forneça um número entre 2 e 100 para o número de mensagens a serem excluídas");
    
      const fetched = await message.channel.fetchMessages({limit: deleteCount});
      message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`Não foi possível deletar mensagens devido a: ${error}`));
  }
  
  // comando chutar
  if(comando === "kick") {
    if(!message.member.roles.some(r=>["Admin", "Moderador"].includes(r.name)) )
    return message.reply("Desculpe, você não tem permissão para usar isto!");
   let member = message.mentions.members.first() || message.guild.members.get(msgs[0]);
  if(!member)
    return message.reply("Por favor mencione um membro válido deste servidor. EX: !kick @user razão");
    if(!member.kickable) 
    return message.reply("Eu não posso expulsar este usuário! Eles pode ter um cargo mais alto ou eu não tenho permissões de expulsar?");

    let reason = msgs.slice(1).join(' ');
    if(!reason) reason = "Nenhuma razão fornecida";

    await member.kick(reason)
    .catch(error => message.reply(`Desculpe ${message.author} não consegui expulsar o membro devido o: ${error}`));
    message.reply(`${member.user.tag} foi kickado por ${message.author.tag} Motivo: ${reason}`);

    }

    // comando ban
    if(comando === "ban") {
    if(!message.member.roles.some(r=>["Admin"].includes(r.name)) )
    return message.reply("Desculpe, você não tem permissão para usar isto!");
    let member = message.mentions.members.first();
    if(!member)
    return message.reply("Por favor mencione um membro válido deste servidor. EX: !ban @user razão");
    if(!member.bannable) 
    return message.reply("Eu não posso banir este usuário! Eles pode ter um cargo mais alto ou eu não tenho permissões de banir?");
    let reason = msgs.slice(1).join(' ');
    if(!reason) reason = "Nenhuma razão fornecida";
    await member.ban(reason)
    .catch(error => message.reply(`Desculpe ${message.author} não consegui banir o membro devido o : ${error}`));
    message.reply(`${member.user.tag} foi banido por ${message.author.tag} Motivo: ${reason}`);
  }

    switch (comando) {
        case "admins" :
        message.channel.send('Nossos administradores e colaboradores são: Leandro Smera');
        break;

        case "fb" :
        message.channel.send('Desculpe-me, mas não consegui encontrar nenhum Facebook cadastrado no nosso banco de dados');
        break;
        
        case "regras" :
        message.channel.send('Veja nossas regras no canal **#info-regras**');
        break;
        
        case "comandos" :
        message.channel.send('!regras, !ajuda, !ping, !admins, !games, !battle, !say, !clear');
        break;
        
        case "games" :
        message.channel.send('Os jogos deste servidor atualmente são: Clash Royale e Free Fire. Para batalhas e horarios digite !battle');
        break;
        
        case "battle" :
        message.channel.send('Para batalhas de Clash Royale digite: **!battleclash**, para Free Fire digite: **!battleff**');
        break;
        
        case "!battleclash" :
        message.channel.send('Estamos sem horarios definidos para Clash Royale, mas em breve estaremos disponibilizando estes horarios. ;)');
        break;
        
        case "battleff" :
        message.channel.send('Squad todas as terças 20h, quintas 20h e sabádos 16h');
        break;
    }
});

bot.login(config.token);