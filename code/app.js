const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const actions = [
	require('./actions/salesData'),
	require('./actions/deployment'),
	require('./actions/githubLabels'),
	require('./actions/lunch'),
	require('./actions/unsplash'),
];
const slackService = require('./services/slack-incoming');

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.get('/', (req, res) => {
	res.render('home');
});

slackService.init(app);
actions.forEach((action) => {
	action(app, slackService);
})

app.listen(port, () => {
	console.log(`Slack bots app listening on port ${port}!`);
});