const process = require('process');
const axios = require('axios');

async function triggerLunchMessage() {
    axios.post('https://hooks.slack.com/services/' + process.env.SLACK_DEVELOPMENT_KEY, {
        text: '*Order lunch*',
        attachments: [
            {
                text: '',
                callback_id: 'order-lunch',
                actions: [
                    {
                        name: 'order',
                        text: 'Order lunch',
                        type: 'button',
                        value: 'order',
                    },
                ]
            }
        ],
    }).catch(console.log);
}

async function openLunchDialog(value, payload) {
    axios.post('https://slack.com/api/dialog.open', {
        trigger_id: payload.trigger_id,
        dialog: {
            callback_id: "lunch-order",
            title: "Choose your menu",
            submit_label: "Order",
            notify_on_cancel: true,
            state: "Limo",
            elements: [
                {
                    type: "select",
                    label: "Restaurant",
                    name: "restaurant",
                    option_groups: [
                        {
                            label: "Braustübl",
                            options: [
                                {
                                    label: "Knuspriges Zigeuner-Schnitzel mit Butterspätzle",
                                    value: "regular",
                                },
                                {
                                    label: "Frische Tagliatelle mit Truthahnragoût und gerösteten Mandeln",
                                    value: "alternative",
                                },
                                {
                                    label: "Knuspriger Winterflammkuchen mit Äpfeln, Maronen und Röstzwiebeln",
                                    value: "vegetarian",
                                }
                            ],
                        },
                        {
                            label: "Nordsee",
                            options: [
                                {
                                    label: "Lachsbrötchen",
                                    value: "salmon",
                                },
                            ],
                        },
                        {
                            label: "Vino",
                            options: [
                                {
                                    label: "Panini",
                                    value: "panini",
                                },
                                {
                                    label: "Fuccatia",
                                    value: "fuccatia",
                                },
                            ],
                        },
                    ],
                },
            ]
        }
    }, {
        headers: {
            Authorization: "Bearer " + process.env.SLACK_OAUTH_TOKEN,
        },
    }).catch(console.log);
}

async function sendLunchConfirmation(value, payload) {
    axios.post('https://hooks.slack.com/services/' + process.env.SLACK_DEVELOPMENT_KEY, {
        text: '*Lunch ordered*\n'
            + 'Ordered ' + payload.submission.restaurant + '\nYour order will arrive in 20 Minutes.',
    }).catch(console.log);
}

module.exports = function (app, slackService) {
    app.get('/lunch-start', (req, res) => {
        triggerLunchMessage();

        res.redirect('/');
    });

    slackService.webhook('order-lunch', 'order', openLunchDialog);
    slackService.webhook('lunch-order', null, sendLunchConfirmation);
}