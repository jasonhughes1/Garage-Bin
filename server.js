const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const environment = process.env.NODE_ENV || 'development';
// const configuration = require('./knexfile')[environment];
// const database = require('knex')(configuration);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.set('port', process.env.PORT || 3000);

app.locals.title = 'Garage Bin';

const requireHTTPS = (req, res, next) => {
  if (req.headers['x-forwarded-proto'] != 'https') {
    return res.redirect('https://' + req.get('host') + req.url);
  }
    next();
};

app.get('/', (request, response) => {
  response.send('Hello World!');
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});
