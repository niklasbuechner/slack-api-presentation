### Mittagessensnachricht

```JavaScript
{
    text: '*Order lunch*',
    attachments: [{
        text: '',
        callback_id: 'order-lunch',
        actions: [{
            name: 'order',
            text: 'Order lunch',
            type: 'button',
            value: 'order',
        }],
    }],
}
```

---

### Dialog öffnen

![Dialog öffnen](public/images/open-dialog.png)

---

### Dialog öffnen

```JavaScript
axios.post('https://slack.com/api/dialog.open', {
        trigger_id: payload.trigger_id,
        dialog: {
            callback_id: "lunch-order",
            title: "Choose your menu",
            submit_label: "Order",
            notify_on_cancel: true,
            elements: [...]
        }
    }, {
        headers: {
            Authorization: "Bearer " + slackOAuthToken,
        },
    }).catch(console.log);
```

---

### Select zusammenstellen

```JavaScript
elements: [{
    type: "select",
    label: "Restaurant",
    name: "restaurant",
    option_groups: [{
        label: "Braustübl",
        options: [{
            label: "Knuspriges Zigeuner-Schnitzel mit Butterspätzle",
            value: "regular",
            // ...
        }],
        // ...
    }],
}]
```
---

### Antwort verarbeiten

```JavaScript
slackService.webhook('lunch-order', null, sendLunchConfirmation);

async function sendLunchConfirmation(value, payload) {
    axios.post('https://hooks.slack.com/services/' + process.env.SLACK_DEVELOPMENT_KEY, {
        text: '*Lunch ordered*\n'
            + 'Ordered ' + payload.submission.restaurant + '\nYour order will arrive in 20 Minutes.',
    }).catch(console.log);
}
```
