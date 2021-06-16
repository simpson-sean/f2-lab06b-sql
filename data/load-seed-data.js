const client = require('../lib/client');
// import our seed data:
const trek = require('./trek.js');
const usersData = require('./users.js');
const { getEmoji } = require('../lib/emoji.js');

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
      trek.map(trek => {
        return client.query(`
                    INSERT INTO trek (id, name, species, faction, role, rank, is_carbon_based)
                    VALUES ($1, $2, $3, $4, $5, $6, $7);
                `,
        [trek.id, trek.name, trek.species, trek.faction, trek.role, trek.rank, trek.is_carbon_based]);
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
