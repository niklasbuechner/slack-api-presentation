const incomingWebhooks = {};

function webhook(callbackId, action, callback) {
    incomingWebhooks[callbackId] = incomingWebhooks[callbackId] || {
        actions: [],
        callback: null,
    };

    if (action) {
        incomingWebhooks[callbackId].actions[action] = callback;
    } else {
        incomingWebhooks[callbackId].callback = callback;
    }
}

function init(app) {
    app.post('/slack-incoming', (req, res) => {
        const payload = JSON.parse(req.body.payload);

        if (payload.actions) {
            payload.actions.forEach(action => {
                if (incomingWebhooks[payload.callback_id] && incomingWebhooks[payload.callback_id].actions[action.name]) {
                    incomingWebhooks[payload.callback_id].actions[action.name](action.value, payload, res);
                }
            });
        }

        if (incomingWebhooks[payload.callback_id].callback) {
            incomingWebhooks[payload.callback_id].callback(null, payload, res);
        }

        res.status(200).end();
    });
}

module.exports = {
    webhook,
    init,
}