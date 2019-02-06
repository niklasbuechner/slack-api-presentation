const process = require('process');
const axios = require('axios');

async function getRandomImageFromUnsplash(responseUrl, query) {
    const result = await axios.get(
        'https://api.unsplash.com/photos/random?query=' + query,
        {
            headers: {
                'Authorization': 'Client-ID ' + process.env.UNSPLASH_ACCESS_KEY
            },
        }
    ).catch(console.log);

    const randomImage = result.data.urls.regular;
    axios.post(responseUrl, {
        text: query,
        attachments: [{
            text: query,
            image_url: randomImage,
        }],
    }).catch(console.log);
}

module.exports = function (app, slackService) {
    app.post('/unsplash', (req, res) => {
        const body = req.body;
        getRandomImageFromUnsplash(body.response_url, body.text);

        res.status(200).end();
    });
}