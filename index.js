var twit = require('twit')
var playerJson = null;
const list = require('./db.json')
const players = list.players

require("dotenv").config();

const Bot = new twit({
    consumer_key: process.env.API_KEY,
    consumer_secret: process.env.API_SECRET_KEY,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    timeout_ms: 60 * 500,
})

var stream = Bot.stream('statuses/filter', { track: '@botplayervlr' });
stream.on('tweet', tweetEvent)

function tweetEvent(tweet) {
    var reply_to = tweet.in_reply_to_screen_name;

    var name = tweet.user.screen_name;

    var txt = tweet.text

    if (reply_to === 'botplayervlr') {
        short_url = txt.replace(/@botplayervlr /g, '');
        buscarJogador(short_url.toLowerCase(), name, tweet)

    }

}

const axios = require('axios');

function buscarJogador(player, userName, tweet) { 
    const playerObj = players.filter(i => i.name === player)
    if (playerObj.length > 0) {
        var reply = '@' + userName + ' ' +
            `Name: ${playerObj[0].originalName}\n` +
            `Team: ${playerObj[0].team}\n` +
            `RND: ${playerObj[0].rnd}\n` +
            `ACS: ${playerObj[0].acs}\n` +
            `KD: ${playerObj[0].kd}\n` +
            `ADR: ${playerObj[0].adr}\n` +
            `KPR: ${playerObj[0].kpr}\n` +
            `FKPR: ${playerObj[0].fkpr}\n` +
            `FDPR: ${playerObj[0].fdpr}\n` +
            `HS%: ${playerObj[0].hs}\n` +
            `CL%: ${playerObj[0].cl}`;
        Bot.post('statuses/update', { status: reply, in_reply_to_status_id: tweet.id_str }, tweeted);
        function tweeted(err, reply) {
            if (err !== undefined) {
                console.log(err);
            } else {
                console.log('Tweeted: ' + reply);
                playerJson = null
            }
        };
    }
}

