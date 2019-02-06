### Die neue Webseite deployen

```JavaScript
'https://hooks.slack.com/services/' + process.env.SLACK_DEVELOPMENT_KEY
```

```JavaScript
{
    text: '*Outstanding Deployment*',
    attachments: [{
        text: 'Would you like to deploy the new website now?',
        fallback: 'Oops, looks like we can not deploy the site 🧐',
        callback_id: 'deploy-website',
        actions: [{
            name: 'deploy',
            text: 'Deploy new website',
            type: 'button',
            value: 'deploy',
        }, {
            name: 'deploy',
            text: 'Deploy old website',
            type: 'button',
            value: 'later',
        }]
    }],
}
```

---

### Interaktive Antwort

```JavaScript
'https://hooks.slack.com/services/XXXX/XXXXXX'
```

![Interaktive Nachrichten](public/images/interactive-message.png)

```JavaScript
'https://your.domain.example/slack-incoming'
```

---

### Interaktive URL definieren

![Slack app](slides/03-site-deployment/interactive-url.png)

---

### Die neue Webseite deployen

```JavaScript
var showOldWebsite = false;
slackService.webhook('deploy-website', 'deploy', (value) => {
    showOldWebsite = value === 'later';
});
```

```JavaScript
app.get('/website', (req, res) => {
    if (showOldWebsite) {
        res.render('old_site');
    } else {
        res.render('new_site');
    }
});
```

---

### Der Slack Service

```JavaScript
const incomingWebhooks = {};

function webhook(callbackId, action, callback) {
    incomingWebhooks[callbackId] =
        incomingWebhooks[callbackId] || {};
    incomingWebhooks[callbackId][action] = callback;
}
```

```JavaScript
app.post('/slack-incoming', (req, res) => {
    const payload = JSON.parse(req.body.payload);
    
    payload.actions.forEach(action => {
        if (incomingWebhooks[payload.callback_id] &&
            incomingWebhooks[payload.callback_id][action.name]) {
            incomingWebhooks[payload.callback_id][action.name](
                action.value, payload, res
            );
        }
    });
    
    res.status(200).end();
});
```

---

### Nachrichten ersetzen

![Nachrichten ersetzen](public/images/replace-message.png)

---

### Nachrichten ersetzen

![Nachrichten mit HTTP Response ersetzen](public/images/replace-message-with-content.png)

---

### Nachrichten ersetzen

![Nachrichten durch extra Request ersetzen](public/images/replace-message-through-extra-request.png)

---

### Nachrichten ersetzen

```JavaScript
slackService.webhook('deploy-website', 'deploy', (value, payload) => {
    // ...
    if (!finalizeDeployment || showOldWebsite) {
        return;
    }

    axios.post(payload.response_url, {
        text: '*Outstanding Deployment*',
        attachments: [{
            text: 'Would you like to deploy the new website' + 
                ' now?\n<@' + payload.user.id +
                '> deployed the *new website*.'
        }],
    });
});
```

---

### Anwendungsbeispiele

![Slack app](public/images/hardware-shop-order-commision-message.png)  <!-- .element class="full-screen-image" -->
