require('dotenv').config();

const Discord = require('discord.js');
const fs = require('fs');


const bot = new Discord.Client({partials: ['CHANNEL', 'GUILD_MEMBER', 'GUILD_SCHEDULED_EVENT', 'MESSAGE', 'REACTION', 'USER']});

bot.commands = new Discord.Collection();
bot.unloadedCommands = new Discord.Collection();

function loadCommands(){
    const cmdFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
    for (const cmd of cmdFiles){
        const cmdName = cmd.split(".")[0];
        const command = require(`./commands/${cmd}`);
        console.log(`loading command: ${cmdName}`);
        try {
            bot.commands.set(command.name, command);
            console.log('Command Loaded: ' + cmdName);
        } catch (error) {
            bot.unloadedCommands.set(command.name, command);
            console.log('Command Unloaded: ' + cmdName);
        }
    }
};

loadCommands();

bot.once('ready', () => {

    console.log(`status -> ONLINE\n${bot.guilds.cache.size} guilds connected.`);
})

bot.on('message', message => {
    if(!message.content.startsWith(process.env.PREFIX) || message.author.bot) return;

    const args = message.content.slice(process.env.PREFIX.length).split(/ +/);
    const command = args.shift().toLocaleLowerCase();
    
    const cmd = bot.commands.get(command);

    if(cmd){
        if(cmd.admin === true){
            if(message.member.hasPermission("ADMINISTRATOR"))
                cmd.run(bot, message, args);
            else
                notify(message, 'You are not an admin!', 3000);
            return;
        }

        if(cmd.permissions != [] && cmd.permissions != undefined){
            if(message.member.hasPermission(cmd.permissions.sort((a,b) => a))){
                cmd.run(bot, message, args);
            } else {
                notify(message, `You Have No Permissions!`, 2500);
                return;
            }
        }
        cmd.run(bot, message, args);
    } else {
        notify(message, `This Command Is Invalid!`, 3000);
    }
})

bot.login(process.env.TOKEN);

const notify = (msg, text, timeout) => {
    msg.reply(text).then(m => setTimeout(() => {
        m.delete();
    }, timeout))
}

module.exports = {bot, notify};