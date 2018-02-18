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
      .catch(error => { throw error; });
  });

  it('should return a 404 for a route that does not exist', () => {
    return chai.request(server)
      .get('/nothere!')
      .then(response => {
        response.should.have.status(404);
      })
      .catch(error => { throw error; });
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
        .get('/api/v1/itemsss')
        .then(response => {
          response.should.have.status(404);
        })
        .catch(error => { throw error; });
    });
  });

  describe('POST /api/v1/items', () => {
    it('should POST a new item', () => {
      return chai.request(server)
        .post('/api/v1/items')
        .send({
          name: 'work bench',
          reason: 'too heavy to move',
          cleanliness: 'rancid'
        })
        .then(response => {
          response.should.have.status(201);
          response.should.be.json;
          response.body.should.be.a('object');
          response.body.should.have.property('id');
        })
        .catch(error => { throw error; });
    });

    it('should return an error message if missing required parameters', () => {
      return chai.request(server)
        .post('/api/v1/items')
        .send({
          name: 'camping stuff'
        })
        .then(response => {
          response.should.have.status(422);
          response.body.error.should.equal('Missing reason.');
        })
        .catch(error => { throw error; });
    });
  })

  describe('PATCH /api/v1/items/:id', () => {
      it('should PATCH a property of a item (cleanliness)', () => {
        return chai.request(server)
          .patch('/api/v1/items/17')
          .send({
            cleanliness: 'rancid'
          })
          .then((response) => {
            response.should.have.status(200);
            response.body.status.should.equal('Successfully updated cleanliness of item #17, to rancid.')
          })
          .catch(error => {throw error; })
    });

it('should return error message if item does not exist', () => {
  return chai.request(server)
    .patch('/api/v1/items/10000')
    .send({
      name: 'changed name'
    })
    .then(response => {
      response.should.have.status(422);
    })
    .catch(error => {
      throw error;
      });
    });
  });
});
