process.env.NODE_ENV = 'test';
const chaiHttp = require('chai-http');
const server = require('../server');
const chai = require('chai');

const should = chai.should();
const knex = require('../db/knex');
const configuration = require('../knexfile')['test'];
const database = require('knex')(configuration);

chai.use(chaiHttp);


describe('Client Routes', () => {
  it('should return the homepage', () => {
    return chai.request(server)
      .get('/')
      .then(response => {
        response.should.have.status(200);
        response.should.be.html;
      })
      .catch(() => {
        console.log('response');
      });
  });

  it('should return a 404 for a route that does not exist', () => {
    return chai.request(server)
      .get('/nothere!')
      .then(() => {
        console.log('response');
      })
      .catch(response => {
        response.should.have.status(404);
      });
  });
});

describe('API Routes', () => {
  beforeEach(done => {
    knex.seed.run()
      .then(() => done());
  });

  describe('GET /api/v1/items', () => {
    it('should GET all of the items', () => {
      return chai.request(server)
        .get('/api/v1/items')
        .then(response => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body[0].should.have.property('name');
          response.body[0].should.have.property('reason');
          response.body[0].should.have.property('cleanliness');
          response.body[0].should.have.property('created_at');
          response.body[0].should.have.property('updated_at');
        })
        .catch(error => { throw error; });
    });

    it('should return 404 status if the url is mistyped', () => {
      return chai.request(server)
        .get('/api/v1/items')
        .then(() => {
          console.log('response');
        })
        .catch(response => {
          response.should.have.status(404);
        });
    });
  });

  describe('POST /api/v1/items', () => {
    it('should POST a new item', () => {
      return chai.request(server)
        .post('/api/v1/items')
        .send({
          id: 10,
          name: 'work bench',
          reason: 'too heavy to move',
          cleanliness: 'rancid'
        })
        .then(response => {
          response.should.have.status(201);
          response.should.be.json;
          response.body.should.have.property('id');
          response.body.id.should.equal(10);
        })
        .catch(error => { throw error; });
    });

    it('should return an error message if missing required parameters', () => {
      return chai.request(server)
        .post('/api/v1/items')
        .send({
          name: 'camping stuff'
        })
        .then(() => {
          console.log('response');
        })
        .catch(error => {
          error.response.should.have.status(422);
          error.response.body.should.be.a('object');
          error.response.body.error.should.equal(
            'You are missing a required parameter');
        });
    });
  })

  describe('PATCH /api/v1/items/id', () => {
      it('should PATCH a property of a item (cleanliness)', () => {
        return chai.request(server)
          .post('/api/v1/items')
          .send({
            cleanliness: 'rancid'
          })
          .then(response => {
            return response.body.id;
          })
          .then(id => {
            return chai.request(server)
              .patch(`/api/v1/items/${id}`)
              .send({
                cleanliness: 'changed cleanliness'
              })
              .then(response => {
                response.should.have.status(201);
                response.body.should.be.a('object');
                response.body.success.should.equal(`Updated items ${id}'s name.`);
              });
          });
      });
    })

it('should return error message if item does not exist', () => {
  return chai.request(server)
    .patch('/api/v1/items/10000')
    .send({
      name: 'changed name'
    })
    .then(() => {
      console.log('response');
    })
    .catch(error => {
      error.response.should.have.status(500);
      error.response.body.should.be.a('object');
      error.response.body.error.should.equal('No item with id 100 found.');
    });
  });
})
