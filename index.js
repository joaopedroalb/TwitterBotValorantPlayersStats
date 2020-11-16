var twit = require('twit')
var fs = require('fs');
var playerJson = null;

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
        buscarJogador(short_url.toLowerCase(),name,tweet)

    }

}

const axios = require('axios');

function buscarJogador(player,userName,tweet) {
    const url = 'http://localhost:3000/players?name=' + player;
    try {
        axios.get(url).then((res, data) => {
            data = res.data

            playerJson = JSON.stringify(data)
            player = JSON.parse(playerJson)
            if (player[0] !== null) {
            var reply = '@' + userName + ' ' +
            `Name: ${player[0].originalName}\n`+
            `Team: ${player[0].team}\n`+
            `RND: ${player[0].rnd}\n`+
            `ACS: ${player[0].acs}\n`+
            `KD: ${player[0].kd}\n`+
           `ADR: ${player[0].adr}\n`+
           `KPR: ${player[0].kpr}\n`+
           `FKPR: ${player[0].fkpr}\n`+
           `FDPR: ${player[0].fdpr}\n`+
           `HS%: ${player[0].hs}\n`+
           `CL%: ${player[0].cl}`;+


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

        }, (error) => {
            console.log(error);
        })

    } catch (error) {
        console.log('deu merda')
    }
}


//buscarJogador('mwzera')