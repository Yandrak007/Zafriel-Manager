const Guild = require("../../database/Schemas/Guild");
const User = require("../../database/Schemas/User");

const GetMention = (id) => new RegExp(`^<@!?${id}>( |)$`);

module.exports = async (client, message) => {
  try {
    User.findOne({ _id: message.author.id }, async function (err, user) {
      if (message.author.bot == true) return;

      if (user) {
        var prefix = "z!";

        if (message.content.match(GetMention(client.user.id))) {
          message.channel.send(
            `Olá ${message.author}, meu prefixo no servidor é **${prefix}**.\n\nPara saber meus comandos use **\`${prefix}help\`**`
          );
        }

        if (message.content.indexOf(prefix) !== 0) return;
        let messageArray = message.content.split(" ");
        let cmd = messageArray[0];
        let args = messageArray.slice(1);
        let cmdFile =
          client.commands.get(cmd.slice(prefix.length)) ||
          client.commands.get(client.aliases.get(cmd.slice(prefix.length)));

        if (cmdFile) {
          return cmdFile.run(client, message, args);
        }
      } else {
        User.create({ _id: message.author.id });
      }
    });
  } catch (err) {
    if (err) console.error(err);
  }
};
