require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  describe('routes', () => {
    let token;
  
    beforeAll(async done => {
      execSync('npm run setup-db');
  
      client.connect();
  
      const signInData = await fakeRequest(app)
        .post('/auth/signup')
        .send({
          email: 'john@arbuckle.com',
          password: 1234
        });
      
      token = signInData.body.token; // eslint-disable-line
  
      return done();
    });
  
    afterAll(done => {
      return client.end(done);
    });

    test('returns trek', async() => {

      const expectation = [
        {
          "id": 100,
          "name": "jean_luc_picard",
          "species": "human",
          "faction": "starfleet",
          "role": "command",
          "rank": "captain",
          "is_carbon_based": true
        },
          
        {
          "id": 101,
          "name": "data",
          "species": "android",
          "faction": "starfleet",
          "role": "command",
          "rank": "lieutenant_commander",
          "is_carbon_based": false
        },

        {
          "id": 102,
          "name": "spock",
          "species": "vulcan",
          "faction": "starfleet",
          "role": "science",
          "rank": "commander",
          "is_carbon_based": true
        },

        {
          "id": 103,
          "name": "weyoun",
          "species": "vorta",
          "faction": "dominion",
          "role": "supervisor",
          "rank": "supervisor",
          "is_carbon_based": true
        },

        {
          "id": 104,
          "name": "general_martok",
          "species": "klingon",
          "faction": "klingon_empire",
          "role": "military",
          "rank": "general",
          "is_carbon_based": true
          }
      ];

      const data = await fakeRequest(app)
        .get('/trek')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });
  });
});
