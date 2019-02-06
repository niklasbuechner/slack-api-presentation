### Command registieren

![Register command](slides/06-unsplash/command-registration.png)

---

### Slash Command verarbeiten

```JavaScript
'https://your.domain.example/unsplash'
```
![Interaktive Nachrichten](public/images/slash-command.png)

---

### Command initialisieren

```JavaScript
app.post('/unsplash', (req, res) => {
    const body = req.body;
    getRandomImageFromUnsplash(body.response_url, body.text);

    res.status(200).end();
});
```

---

### Bild laden

```JavaScript
async function getRandomImageFromUnsplash(responseUrl, query) {
    const result = await axios.get(
        'https://api.unsplash.com/photos/random?query=' + query,
        {
            headers: {
                'Authorization': 'Client-ID '
                    + process.env.UNSPLASH_ACCESS_KEY
            },
        }
    ).catch(console.log);

    // ...
}
```

---

### Bild anzeigen

```JavaScript
async function getRandomImageFromUnsplash(responseUrl, query) {
    // ...

    const randomImage = result.data.urls.regular;
    axios.post(responseUrl, {
        text: query,
        attachments: [{
            text: query,
            image_url: randomImage,
        }],
    }).catch(console.log);
}
```