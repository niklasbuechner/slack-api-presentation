### GitHub Issue Event

![Slack app](public/images/github-labels-event.png)

---

### Label hinzufügen

![Slack app](public/images/github-labels.png)

---

### GitHub Events empfangen

![Slack app](slides/04-github-labels/github-webhooks.png)

---

### GitHub Events verarbeiten

```
app.post('/label-event', (req, res) => {
    if (!req.body.issue) {
        res.send('NO');
        res.status(502).end();

        return;
    }

    const issue = req.body.issue;
    triggerGithubIssueMessage(issue.title, issue.body, issue.number);

    res.send('YES');
    res.status(200).end();
});
```

---
### Vorhandene Labels auslesen

```JavaScript
const query =
`query ($repositoryOwner: String!, $repositoryName: String!) { 
    repository(owner: $repositoryOwner, name: $repositoryName) {
        labels(first: 20) {
            nodes {
                id,
                name,
            }
        }
    }
}`;
```

---

### Vorhandene Labels auslesen

```JavaScript
const response = await axios.post(
    'https://api.github.com/graphql', {
        query,
        variables: {
            repositoryOwner: owner,
            repositoryName: name,
        }
    },{
        headers: {
            'Content-Type': 'application/json',
            'Authorization': ' token ' + process.env.GITHUB_TOKEN,
        },
});

return response.data.data.repository.labels.nodes;
```

---

### Slack-Nachricht erstellen

```JavaScript
{
    text: '*New GitHub Issue created*\n'
        + 'Please add labels to the issue #' + number + '\n',
    attachments: [{
        text: '*' + labelTitle + '*\n' + labelMessage,
        fallback: 'Oops, looks like we can\'t add labels',
        callback_id: 'add-labels',
        actions: [{
            name: 'labels',
            text: 'enhancement',
            type: 'button',
            value: label.name + '-' + number,
        }],
    }]
}
```
---

### Label in GitHub hinzufügen

```JavaScript
const githubRepo = process.env.GITHUB_REPOSITORY;
await github.addLabel(githubRepo, number, name);
```

```JavaScript
const githubToken = process.env.GITHUB_TOKEN;
async function addLabel(repo, number, label) {
    return axios.post(
        'https://api.github.com/repos/' + repo +
            '/issues/' + number + '/labels',
        {
            labels: [label],
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': ' token ' + githubToken,
            },
        }
    );
}
```

---

### State in Nachrichten speichern

```JavaScript
{
    text: '*New GitHub Issue created*\n'
        + 'Please add labels to the issue #' + number + '\n',
    attachments: [{
        text: '*' + labelTitle + '*\n' + labelMessage,
        fallback: 'Oops, looks like we can\'t add labels',
        callback_id: 'add-labels',
        actions: [{
            name: 'labels',
            text: 'enhancement',
            type: 'button',
            value: label.name + '-' + number,
        }],
    }]
}
```

---

### Anwendungsbeispiele

![Slack app](public/images/pollo-bot.png) <!-- .element class="half-height-image-left" -->

![Slack app](public/images/door-bell-bot.png)  <!-- .element class="half-height-image-right" -->
