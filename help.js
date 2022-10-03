const { MessageEmbed } = require("discord.js");

module.exports.run = (client, message, args) => {
    const help = new MessageEmbed()
        .setColor(0xff0042)
        .setAuthor({name: client.user.tag })
        .setTitle("Instructiuni")
        .setFields(
            {
                name: "Descriere comanda",
                value: 'Afiseaza paritatea saptamani\ncurente de facultate.\n\nAfiseaza orarul aferent\nsemigrupei date ca argument\n(a || b)',
                inline: true
            },
            {
                name: "Mod de folosire",
                value: ':saptamana\n\n\n:orar <semigrupa>',
                inline: true
            }
        )
        .setTimestamp()
        .setFooter({ text: 'Zi faina iti doresc!' });

    message.channel.send({embeds: [help] });
}

module.exports.name = "help";