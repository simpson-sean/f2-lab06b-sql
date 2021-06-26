//import libraries from outside
const express = require('express');
const cors = require('cors');
const client = require('./client.js');
const app = express();
const morgan = require('morgan');
const ensureAuth = require('./auth/ensure-auth');
const createAuthRoutes = require('./auth/create-auth-routes');

//Not really sure what's going on here.
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev')); // http logging

const authRoutes = createAuthRoutes();

// setup authentication routes to give user an auth token
// creates a /auth/signin and a /auth/signup POST route. 
// each requires a POST body with a .email and a .password
app.use('/auth', authRoutes);

// everything that starts with "/api" below here requires an auth token!
app.use('/api', ensureAuth);


// *******************************APP AND TEST FUNCTIONS**********************************

// and now every request that has a token in the Authorization header will have a `req.userId` property for us to see who's talking
app.get('/api/test', (req, res) => {
  res.json({
    message: `in this proctected route, we get the user's id like so: ${req.userId}`
  });
});

//GET entire character list from TREK_CHARACTER and JOIN faction data from TREK_FACTION
app.get('/trek_character', async(req, res) => {
  try {
    const data = await client.query(`
          SELECT  tc.id, tc.name, tc.species, tf.faction AS faction, tc.category, tc.rank, tc.is_carbon_based
          FROM 	  trek_character AS tc
          JOIN 	  trek_faction AS tf
          ON 		  tc.faction_id = tf.id
    `);
    
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});
//GET character by ID
app.get('/trek_character/:id', async(req, res) => {
  try {
    const data = await client.query(`
          SELECT  tc.id, tc.name, tc.species, tf.faction AS faction, tc.category, tc.rank, tc.is_carbon_based
          FROM 	  trek_character AS tc
          JOIN 	  trek_faction AS tf
          ON 		  tc.faction_id = tf.id
          WHERE   tc.id=$1;
        `, [req.params.id]);
        
    
    res.json(data.rows[0]);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

//POST new character data
app.post('/trek_character', async(req, res) => {
  try {
    const data = await client.query(`
          INSERT INTO trek_character (name, species, faction_id, category, rank, is_carbon_based)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING *`, 
    
    [req.body.name, req.body.species, req.body.faction_id, req.body.category, req.body.rank, req.body.is_carbon_based]);

    
    res.json(data.rows[0])
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

//UPDATE existing character data
app.put('/trek_character/:id', async(req, res) => {
  try {
    const data = await client.query(`
      UPDATE trek_character
      SET name=$1,
      species=$2,
      category=$3,
      rank=$4,
      is_carbon_based=$5
      WHERE id=$6
      RETURNING *
      `, 
      [req.body.name, req.body.species, req.body.category, req.body.rank, req.body.is_carbon_based, req.params.id]);
    
    res.json(data.rows[0]);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

//DELETE character entry
app.delete('/trek_character/:id', async(req, res) => {
  try {
    const data = await client.query(`delete from trek_character where id=$1`, [req.params.id]);
    
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

//GET all faction data
app.get('/trek_faction', async(req, res) => {
  try {
    const data = await client.query(`
        SELECT id, faction
        FROM trek_faction
    
    `);

    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

//GET faction by ID
app.get('/trek_faction/:id', async(req, res) => {
  try {
    const data = await client.query(`SELECT * from trek_faction where id=${req.params.id}`);
    
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

//POST to faction data
app.post('/trek_faction', async(req, res) => {
  try {
    const data = await client.query(`
      INSERT INTO trek_faction (faction)
      VALUES ($1)
      RETURNING *`, 
      [req.body.faction]);


    res.json(data.rows[0]);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

//UPDATE faction data by ID
app.put('/trek_faction/:id', async(req, res) => {
  try {
    const data = await client.query(`
      UPDATE trek_faction
      SET faction=$1
      WHERE id=$2
      RETURNING *
      `, 
      [req.body.faction, req.params.id]);
    
    res.json(data.rows[0]);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

//DELETE faction by ID
app.delete('/trek_faction/:id', async(req, res) => {
  try {
    const data = await client.query(`delete from trek_faction where id=$1`, [req.params.id]);
    
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.use(require('./middleware/error'));

module.exports = app;
