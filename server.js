const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

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

app.get('/api/v1/items', (request, response) => {
  database('items').select()
    .then((items) => {
      response.status(200).json(items);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

app.post('/api/v1/items', (request, response) => {
  const item = request.body;

  for(let requiredParameter of ['name', 'reason', 'cleanliness']) {
    if(!item[requiredParameter]) {
      return response.status(422).send({ error: `Missing ${requiredParameter}.`})
    }
  }
  database('items').insert(item, 'id')
    .then(item => {
      return response.status(201).json({ id: item[0]})
    })
    .catch(error => {
      return response.status(500).json({ error })
    })
})

app.patch('/api/v1/items/:id', (request, response) => {
  const id = request.params.id;
  const cleanliness = request.body.cleanliness;
  database('items').where('id', id).update({ cleanliness })
    .then( (res) => {
      if (!res) {
        response.status(404).json({ error: `No item has an id of ${id}`});
      } else {
        response.status(200).json( { status: `Successfully updated cleanliness of item #${id}, to ${cleanliness}.`});
      }
    })
    .catch(error => {
      response.status(422).json({ error });
    });
  });

module.exports = app;
