const process = require('process');
const axios = require('axios');

let showOldWebsite = true;
let finalizeDeployment = false;

async function triggerDeployment() {
    axios.post('https://hooks.slack.com/services/' + process.env.SLACK_DEVELOPMENT_KEY, {
        text: '*Outstanding Deployment*',
        attachments: [
            {
                text: 'Would you like to deploy the new website now?',
                fallback: 'Oops, looks like we can\'t deploy the site 🧐',
                callback_id: 'deploy-website',
                actions: [
                    {
                        name: 'deploy',
                        text: 'Deploy new website',
                        type: 'button',
                        value: 'deploy',
                    },
                    {
                        name: 'deploy',
                        text: 'Deploy old website',
                        type: 'button',
                        value: 'later',
                    },
                ]
            }
        ],
    }).catch(console.log);
}


module.exports = function (app, slackService) {
    app.get('/deploy-data', (req, res) => {
        triggerDeployment();

        res.redirect('/');
    });
    app.get('/finalize-deployment', (req, res) => {
        finalizeDeployment = true;

        res.redirect('/');
    });
    app.get('/website', (req, res) => {
        if (showOldWebsite) {
            res.render('old_site');
        } else {
            res.render('new_site');
        }
    });

    slackService.webhook('deploy-website', 'deploy', (value, payload, res) => {
        showOldWebsite = value === 'later';

        if (!finalizeDeployment || showOldWebsite) {
            return;
        }
        axios.post(payload.response_url, {
            text: '*Outstanding Deployment*',
            attachments: [
                {
                    text: 'Would you like to deploy the new website now?\n' +
                        '<@' + payload.user.id + '> deployed the *new website*.',
                }
            ],
        });
    });
}