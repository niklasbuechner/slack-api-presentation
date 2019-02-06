const process = require('process');
const axios = require('axios');
const github = require('../services/github');

let labels =  [];
async function slackMessage(labelTitle, labelMessage, number, message) {
    if (labels.length < 1) {
        labels = await github.getAvailableLabels(process.env.GITHUB_REPOSITORY);
    }

    let newMessage;
    if (message) {
        newMessage = {
            text: message.text,
            attachments: message.attachments,
        };
    } else {
        newMessage = {};
    }

    const buttons = labels.map(label => {
        let text;
        if (label.added) {
            text = 'Remove ' + label.name;
        } else {
            text = label.name;
        }

        return {
            name: 'labels',
            text,
            type: 'button',
            value: label.name + '-' + number,
        }
    });

    if (!newMessage.text) {
        newMessage.text = '*New GitHub Issue created*\n'
            + 'Please add labels to the issue #' + number + '\n';
        newMessage.attachments = [
            {
                text: '*' + labelTitle + '*\n' + labelMessage,
                fallback: 'Oops, looks like we can\'t add labels',
                callback_id: 'add-labels',
                actions: buttons,
            }
        ];
    }
    newMessage.attachments[0].actions = buttons;

    return newMessage;
}

async function triggerGithubIssueMessage(labelTitle, labelMessage, number) {
    axios.post(
        'https://hooks.slack.com/services/' + process.env.SLACK_DEVELOPMENT_KEY, 
        await slackMessage(labelTitle, labelMessage, number)
    ).catch(console.log);
}


module.exports = function (app, slackService) {
    app.post('/label-event', (req, res) => {
        if (!req.body.issue) {
            res.send('NO');
            res.status(502).end();

            return;
        }

        res.send('YES');
        res.status(200).end();

        // Only allow messages for newly created issues.
        if (req.body.action != 'opened') {
            return;
        }

        const issue = req.body.issue;
        triggerGithubIssueMessage(issue.title, issue.body, issue.number);
    });

    app.get('/create-issue', (req, res) => {
        triggerGithubIssueMessage(
            'Finish webdev issue labeling',
            'Please add the full issue labeling feature.',
            1
        );

        res.redirect('/');
    });

    slackService.webhook('add-labels', 'labels', async (value, payload, res) => {
        res.status(200).end();

        if (labels.length < 1) {
            labels = await github.getAvailableLabels(process.env.GITHUB_REPOSITORY)
        }

        const [name, number] = value.split('-');
        let removeLabel = false;
        for (let index = 0; index < labels.length; index++) {
            if (labels[index].name == name) {
                removeLabel = labels[index].added || false;
                labels[index].added = !labels[index].added;
            }
        }

        const newMessage = await slackMessage('', '', number, payload.original_message);
        axios.post(payload.response_url, newMessage);
        try {
            if (removeLabel) {
                await github.removeLabel(
                    process.env.GITHUB_REPOSITORY,
                    number,
                    name
                );
            } else {
                await github.addLabel(
                    process.env.GITHUB_REPOSITORY,
                    number,
                    name
                );
            }
        } catch (error) {
            console.log(error);
        }
    });
}