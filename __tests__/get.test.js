//Import modules for testing
require('dotenv').config();
const { execSync } = require('child_process');
const fakeRequest = require('supertest');
const app = require('../lib/app.js');
const client = require("../lib/client");

//declare local constants
const spock = {            
  'id': 3,
  'name': "spock",
  'species': "vulcan",
  'faction': "starfleet",
  'category': "science",
  'rank': "commander",
  'is_carbon_based': true,
};
const trekCharacters = [
  {
      "id": 3,
      "name": "spock",
      "species": "vulcan",
      "faction": "starfleet",
      "category": "science",
      "rank": "commander",
      "is_carbon_based": true
  },
  {
      "id": 2,
      "name": "data",
      "species": "android",
      "faction": "starfleet",
      "category": "command",
      "rank": "lieutenant_commander",
      "is_carbon_based": false
  },
  {
      "id": 1,
      "name": "jean_luc_picard",
      "species": "human",
      "faction": "starfleet",
      "category": "command",
      "rank": "captain",
      "is_carbon_based": true
  },
  {
      "id": 5,
      "name": "general_martok",
      "species": "klingon",
      "faction": "klingon_empire",
      "category": "military",
      "rank": "general",
      "is_carbon_based": true
  },
  {
      "id": 4,
      "name": "weyoun",
      "species": "vorta",
      "faction": "dominion",
      "category": "supervisor",
      "rank": "supervisor",
      "is_carbon_based": true
  }
];

describe('app routes', () => {
    describe('routes', () => {
      let token;
    
      beforeAll(async done => {
        execSync('npm run setup-db');
    
        client.connect();
        
        const signInData = await fakeRequest(app)
          .post('/auth/signup')
          .send({
            email: 'test@test.com',
            password: '1234'
          });
        
        
  
        token = signInData.body.token; // eslint-disable-line
    
        return done();
      });
    
      afterAll(done => {
        return client.end(done);
      });
  
      test('/GET returns all trek_character', async() => {
  

        const data = await fakeRequest(app)
          .get('/trek_faction')
          .expect('Content-Type', /json/)
          .expect(200);
  
        expect(data.body.length).toBeGreaterThan(3);
      });

      test('/GET/:id returns specific trek_character', async() => {

        const expectation = spock
        const data = await fakeRequest(app)
            .get('/trek_character/3')
            .expect('Content-Type', /json/)
            .expect(200);

        expect(data.body).toEqual(expectation);
  
      });
    
      test('/GET returns all trek_faction', async() => {
  
        const expectation = trekCharacters
        const data = await fakeRequest(app)
          .get('/trek_character')
          .expect('Content-Type', /json/)
          .expect(200);
  
        expect(data.body).toEqual(expectation);
      });

    });
});
