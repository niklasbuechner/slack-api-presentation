const process = require('process');
const axios = require('axios');

async function triggerSalesDataMessage() {
    axios.post('https://hooks.slack.com/services/' + process.env.SLACK_SALES_KEY, {
        text: '*_Gestrige Verkaufszahlen 🎉_*' +
            '\n' +
            '\n' +
            'Hardwarebestellungen: *15.720€*\n' +
            'Softwareverkäufe: *15.720€*',
    }).catch(console.log);
}


module.exports = function (app) {
    app.get('/sales-data', (req, res) => {
        triggerSalesDataMessage();

        res.redirect('/');
    });
}