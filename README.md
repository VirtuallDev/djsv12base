# djsv12base


- Command example:
```js
const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
    name: 'example',
    description: 'example',
    admin: false,
    permissions: [], // add any type of discord permission over heere
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {string[]} args 
     */
    run: (client, message, args) => {
        message.reply("This Command Works!");
    }
}

```

- Will publish a new version with Slash Commands & interactions soon...
