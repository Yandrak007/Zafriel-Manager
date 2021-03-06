const Discord = require("discord.js");
const moment = require("moment");
require("moment-duration-format");
const Guild = require("../../database/Schemas/Guild");
const User = require("../../database/Schemas/User");
// const sourcebin = require('sourcebin');

exports.run = async (client, message, args) => {
  moment.locale("pt-BR");
  Guild.findOne({ _id: message.guild.id }, async function (err, server) {
    User.findOne({ _id: message.author.id }, async function (err, user) {
      if (!server.cmd.length)
        return message.quote(
          `${message.author}, não tenho nenhum comando ainda.`
        );

      const COMANDOS = new Discord.MessageEmbed()
        .setColor(process.env.EMBED_COLOR)
        .setAuthor(
          `${client.user.username} - Comandos`,
          client.user.displayAvatarURL({ size: 2048 })
        )
        .setFooter(
          `Pedido por ${message.author.username}`,
          message.author.displayAvatarURL({ dynamic: true })
        )
        .setThumbnail(client.user.displayAvatarURL({ size: 2048 }))
        .addField(
          `Comandos:`,
          server.cmd.map((x) => `\`${x.name}\``).join(", ")
        );
      if (
        !args[0] ||
        !server.cmd.find((x) => x.name.toLowerCase() == args[0].toLowerCase())
      ) {
        return message.quote(message.author, COMANDOS);
      }

      if (!server.cmd.find((x) => x.name.toLowerCase() == args[0].toLowerCase()).verify) {
        return message.quote(
          `${message.author}, este comando ainda não foi verificado, por favor aguarde até que ele seja verificado para pegar o código.`
        );
      } else {
        const cmd = server.cmd.find((x) => x.name.toLowerCase() == args[0].toLowerCase());
        let author = await client.users.fetch(cmd.author);

        const CMD = new Discord.MessageEmbed()
          .setColor(process.env.EMBED_COLOR)
          .addFields(
            {
              name: "Nome do Comando",
              value: cmd.name,
            },
            {
              name: `Comando:`,
              value: `**[Clique Aqui](${cmd.url})**`,
            },
            {
              name: "Enviado por",
              value: author.tag,
            },
            {
              name: "Enviado em",
              value: moment(cmd.date).format("LLL"),
            }
          )
          .setThumbnail(client.user.displayAvatarURL({ size: 2048 }))
          .setFooter(
            `Pedido por ${message.author.username}`,
            message.author.displayAvatarURL({ dynamic: true })
          );

        message.channel.send(CMD);
      }
    });
  });
};
exports.help = {
  name: "cmd",
  aliases: [],
  category: "Utils",
  description:
    "Use este comando para pegar algum comando enviado por um usuário",
  usage: "cmd <cmd name>",
};
