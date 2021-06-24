const client = require('../lib/client');
const { getEmoji } = require('../lib/emoji.js');

// async/await needs to run in a function
run();

async function run() {

  try {
    // initiate connecting to db
    await client.connect();

    // run a query to create tables
    await client.query(`
                CREATE TABLE users (
                    id SERIAL PRIMARY KEY,
                    email VARCHAR(256) NOT NULL,
                    hash VARCHAR(512) NOT NULL
                );  
                CREATE TABLE trek_faction (
                    id SERIAL PRIMARY KEY NOT NULL,
                    faction VARCHAR(512) NOT NULL
                );
                CREATE TABLE trek_character (
                    id SERIAL PRIMARY KEY NOT NULL,
                    name VARCHAR(512) NOT NULL,
                    species VARCHAR(512) NOT NULL,
                    faction INTEGER NOT NULL REFERENCES trek_faction(id),
                    category VARCHAR(512) NOT NULL,
                    rank VARCHAR(512) NOT NULL,
                    is_carbon_based VARCHAR(512) NOT NULL
                );

           `);

    console.log('create tables complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch(err) {
    // problem? let's see the error...
    console.log(err);
  }
  finally {
    // success or failure, need to close the db connection
    client.end();
  }

}
