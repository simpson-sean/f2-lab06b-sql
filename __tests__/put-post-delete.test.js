//import modules needed for tests
require('dotenv').config();
const { execSync } = require('child_process');
const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');
const { getFactionIdByName } = require('../lib/utils/utils.js');

const trekCharacters = [
    { 
        "name": "jean_luc_picard",
        "species": "human",
        "faction": "starfleet",
        "category": "command",
        "rank": "captain",
        "is_carbon_based": true
      },  
      {
        "name": "data",
        "species": "android",
        "faction": "starfleet",
        "category": "command",
        "rank": "lieutenant_commander",
        "is_carbon_based": false
      },
      {
        "name": "spock",
        "species": "vulcan",
        "faction": "starfleet",
        "category": "science",
        "rank": "commander",
        "is_carbon_based": true
      },
      {
        "name": "weyoun",
        "species": "vorta",
        "faction": "dominion",
        "category": "supervisor",
        "rank": "supervisor",
        "is_carbon_based": true
      },
      {
        "name": "general_martok",
        "species": "klingon",
        "faction": "klingon_empire",
        "category": "military",
        "rank": "general",
        "is_carbon_based": true
        }
    ];

describe('app routes', () => {
  describe('routes', () => {
    let token;
    let factions;

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

      const factionData = await fakeRequest(app).get('/trek_faction');
      factions = factionData.body;
  

      return done();
    });
  
    afterAll(done => {
      return client.end(done);
    });
    

    test('/POST trek_character creates new character', async() => {
        
        const factionId = getFactionIdByName(factions, 'starfleet');
        const addCharacter = await fakeRequest(app)
            .post('/trek_character')
            .send({
                name: 'new characacter name',
                species: 'species name',
                faction_id: factionId,
                category: 'type of character',
                rank: 'character rank',
                is_carbon_based: true
            })

            .expect('Content-Type', /json/)
            .expect(200);
        
        const getCharacter = await fakeRequest(app)
            .get('/trek_character')
            .expect("Content-Type", /json/)
            .expect(200);

        const postCharacter = {
            'name': 'name',
            'species': 'species type',
            'faction': factionId,
            'category': 'new category',
            'rank': 'new rank',
            'is_carbon_based': true

        }

        const newCharacter = {
            'name': 'name',
            'species': 'species type',
            'faction': 'starfleet',
            'category': 'new category',
            'rank': 'new rank',
            'is_carbon_based': true

        };

        expect(data.body).toEqual(postCharacter);

    })

    test('/PUT update a single character', async() => {

        //request to update character
        const data = await fakeRequest(app)
            .put('/trek_character')
            .send({
                name: 'updated character',
                species: 'updated species',
                faction: getFactionIdByName(factions, 'starfleet'),
                category: 'update category',
                rank: 'updated rank',
                is_carbon_based: true
            })

            .expect('Content-Type', /json/)
            .expect(200);


    })
    
  });
});
