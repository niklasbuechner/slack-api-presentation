### Wie funktioniert der Server?
```JavaScript
const app = express();
// Weitere Abhängigkeiten

const slackService = require('./services/slack-incoming');
const actions = [
    require('./actions/salesData'),
    // ...
];

slackService.init(app);
actions.forEach((action) => {
    action(app, slackService);
})

app.listen(port);
```

---

### Nachrichten in einen Channel posten
```JavaScript
'https://hooks.slack.com/services/XXXX/XXXXXX'
```
![Wie lief es gestern Nachricht](public/images/message-diagramm.png)

---

### Slack-Nachrichten per URL einrichten

![Slack app](slides/02-sales-data/register-channel-url.png)

---

### Wie lief es gestern?

```JavaScript
const process = require('process');
const axios = require('axios');

async function triggerSalesDataMessage() {
    axios.post(
        'https://hooks.slack.com/services/' + process.env.SLACK_SALES_KEY, {
        text: '*_Gestrige Verkaufszahlen 🎉_*' +
        '\n' +
        '\n' +
        'Hardwarebestellungen: *15.720€*\n' +
        'Softwareverkäufe: *15.720€*',
    }).catch(console.log);
}
```

```
module.exports = function (app) {
    app.get('/sales-data', (req, res) => {
        triggerSalesDataMessage();
        
        res.redirect('/');
    });
}
```

---

### Anwendungsbeispiele

![Slack app](public/images/hardware-shop-order-message.png) <!-- .element class="half-height-image-left" -->

![Slack app](public/images/lunch-message.png)  <!-- .element class="half-height-image-right" -->
