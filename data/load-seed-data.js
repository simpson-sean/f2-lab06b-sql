const client = require('../lib/client');

// import our seed data:
const trek = require('./trek.js');
const faction = require('./faction.js');
const usersData = require('./users.js');
const { getEmoji } = require('../lib/emoji.js');
//const { getFactionbyId } = require('../lib/utils.js');



run();

async function run() {

  try {
    await client.connect();

    const users = await Promise.all(
      usersData.map(user => {
        return client.query(`
                      INSERT INTO users (email, hash)
                      VALUES ($1, $2)
                      RETURNING *;
                  `,
        [user.email, user.hash]);
      })
    );
      
    const user = users[0].rows[0];

    await Promise.all(
      faction.map(faction => {
        return client.query(`
                      INSERT INTO trek_faction (faction)
                      VALUES ($1)
        `,
        [faction.faction]);
      })
    )


    await Promise.all(
      trek.map(trek => {
        console.log(trek);
        return client.query(`
                      INSERT INTO trek_character (name, species, faction_id, category, rank, is_carbon_based)
                      VALUES ($1, $2, $3, $4, $5, $6)
          `,
        [trek.name, trek.species, trek.faction_id, trek.category, trek.rank, trek.is_carbon_based]);
      })
    );



    

    console.log('seed data load complete', getEmoji(), getEmoji(), getEmoji());
  }
  
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }
    
}
