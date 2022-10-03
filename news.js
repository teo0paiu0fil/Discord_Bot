
const { MessageEmbed } = require('discord.js');
const mongoose = require('mongoose');

const axios = require('axios');
const cheerio = require('cheerio');
const url = "https://acs.pub.ro/topic/noutati/";

const https = require('https');
const httpsAgent = new https.Agent({ rejectUnauthorized: false });

const NewsSchema = new mongoose.Schema({
    _id: Number,
    name: String,
    description: String,
    link: String,
});

const NewS = mongoose.model('News', NewsSchema);

module.exports.run = async (client, message, mongoose) => {
    const embed = new MessageEmbed()
        .setColor(0xff0042)
        .setAuthor({name: client.user.tag}) 
        .setFooter({ text: 'Zi faina iti doresc!' });

    const func = fetchData(url).then( async (res) => {
        const html = res.data;
        const $ = cheerio.load(html);
        const news = $(".event")[0];
        const list = $(news).find("li")[0];
        let postTitleWrapper = $(list).find("a"),
            postTitle = $(postTitleWrapper).text(),
            postLink = $(postTitleWrapper).attr('href');
            
        let postDateWrapper = $(list).find('.time');
            embed.setTitle(postTitle)
                .setTimestamp(postDateWrapper.text())
                .setURL(postLink);

        await fetchData(postLink).then( async (res) => {
                const html1 = res.data;
                const $ =  cheerio.load(html1);
                const text = $(".main")[0];
                let description = $(text).find("p").text();
                embed.setDescription(description);    

                const doc = await NewS.findById(1);

                if (doc.link == postLink && doc.name == postTitle && description == doc.description ) {
                    return;
                } else {
                    NewS.findByIdAndUpdate(1, {$set: {
                        name: postTitle,
                        link: postLink,
                        description: description
                    }}, (err, result)=>{
                        if (err) throw new Error(err);
                        console.log(result)
                        return
                    });
                    message.send({embeds: [embed] });
                }
        });          
    });
}

async function fetchData(url) {  // GET 
    console.log("Crawling data...")
    
    let response = await axios(url, { httpsAgent }).catch((err) => console.log(err));

    if(response.status !== 200){
        console.log("Error occurred while fetching data");
        return;
    }
    return response;
}

module.exports.name = "news";
