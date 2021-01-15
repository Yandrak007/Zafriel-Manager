const Guild = require("../../database/Schemas/Guild");

exports.run = (client, message, args) => {
  Guild.findOne({ _id: message.guild.id }, async function (err, server) {
    let prefixos = args[0];

    if (!prefixos) {
      return message.channel.send(
        `${message.author}, você não inseriu nenhum prefixo para eu alterar.AATEST`
      );
    } else if (prefixos.length > 5) {
      return message.channel.send(
        `${message.author}, você deve inserir um prefixo com no máximo 5 caracteres.`
      );
    } else if (prefixos == server.prefix) {
      return message.channel.send(
        `${message.author}, não foi possível alterar o prefixo, poís o prefixo inserido é o mesmo setado atualmente, tente novamente.`
      );
    } else {
      message.channel.send(
        `${message.author}, meu prefixo em seu servidor foi alterado para **\`${prefixos}\`** com sucesso.`
      );

      await Guild.findOneAndUpdate(
        { _id: message.guild.id },
        { $set: { prefix: prefixos } }
      );
    }
  });
};

exports.help = {
  name: "prefix",
  aliases: ["prefixo"],
  category: "Config"
};
