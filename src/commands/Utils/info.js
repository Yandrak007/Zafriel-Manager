const Discord = require("discord.js");
const moment = require("moment");
require("moment-duration-format");
const Guild = require("../../database/Schemas/Guild");
const User = require("../../database/Schemas/User");
const Client = require("../../database/Schemas/Client");

exports.run = async (client, message, args) => {
  moment.locale("pt-BR");

  let USER = message.guild.member(
    client.users.cache.get(args[0]) ||
      message.mentions.members.first() ||
      message.author
  );

  if (!USER)
    return message.channel.send(
      `${message.author}, você deve mencionar/inserir o ID do membro que deseja saber as informações.`
    );

  Guild.findOne({ _id: message.guild.id }, async function (err, server) {
    Client.findOne({ _id: client.user.id }, async function (err, bot) {

      let info;
      if(USER.user.bot) info = bot.bots.map(x => x).find(f => f.id == USER.id).owner
      else info = USER.id

      User.findOne({ _id: info }, async function (err, user) {

      if (!user.addBot.haveBot)
        return message.channel.send(
          `${message.author}, este membro não possui nenhum Bot adicionado no servidor.`
        );

      let EMBED = new Discord.MessageEmbed()
        .setAuthor(`Informações do Bot do usuário ${USER.user.bot ? client.users.cache.get(info).tag : USER.user.tag}`)
        .addFields(
          {
            name: `Nome do Bot`,
            value: `${client.users.cache.get(user.addBot.idBot).username}`,
          },
          {
            name: `Dono`,
            value: USER.user.bot ? client.users.cache.get(info).tag : USER.user.tag
          },
          {
            name: "ID do Bot",
            value: user.addBot.idBot,
          },
          {
            name: "Bot aceito por",
            value: user.addBot.acceptBy,
          },
          {
            name: "Aceito em",
            value: `${moment(user.addBot.acceptIn).format("L")} ( há **${String(
              moment
                .duration(Date.now() - user.addBot.acceptIn)
                .format("M [meses] d [dias] h [horas] m [minutos] s [segundos]")
            ).replace("minsutos", "minutos")}** )`,
          }
        )
        .setThumbnail(USER.user.displayAvatarURL({ dynamic: true }))
        .setColor(process.env.EMBED_COLOR);

      message.channel.send(EMBED);
    });
  });
})
};
exports.help = {
  name: "info",
  aliases: [],
  category: "Utils",
  description: "Use este comando para ver informações sobre o Bot de alguém",
  usage: "info <user>",
};
