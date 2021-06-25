require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app.js');
const client = require("../lib/client");


describe('app routes', () => {
    describe('routes', () => {
      let token;
    
      beforeAll(async done => {
        execSync('npm run setup-db');
    
        client.connect();
        
        console.log('hello world');
  
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
  
      

      test('/GET/:id returns specific trek_character', async() => {

        const expectation = {
                
                'id': 3,
                'name': "spock",
                'species': "vulcan",
                'faction': "starfleet",
                'category': "science",
                'rank': "commander",
                'is_carbon_based': true,
            };

        const data = await fakeRequest(app)
            .get('/trek_character/3')
            .expect('Content-Type', /json/)
            .expect(200);

        expect(data.body).toEqual(expectation);

      
      });
    });
});
