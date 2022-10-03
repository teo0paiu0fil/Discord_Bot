
module.exports.run = (client, message, args) => {
    let currentDate = new Date();
    startDate = new Date(currentDate.getFullYear(), 0, 1);

    let days = Math.floor((currentDate - startDate)/(24 * 60 * 60 * 1000));
    let weekNumber = Math.floor(days / 7);
    let whichOne = (weekNumber % 2 == 0) ? 'para' : 'impara';
    
    message.channel.send(`Saptamana asta este ${whichOne}!`);

}

module.exports.name = "week";
