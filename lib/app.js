const express = require('express');
const cors = require('cors');
const client = require('./client.js');
const app = express();
const morgan = require('morgan');
const ensureAuth = require('./auth/ensure-auth');
const createAuthRoutes = require('./auth/create-auth-routes');

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

// and now every request that has a token in the Authorization header will have a `req.userId` property for us to see who's talking
app.get('/api/test', (req, res) => {
  res.json({
    message: `in this proctected route, we get the user's id like so: ${req.userId}`
  });
});

//(GET, POST, PULL, DELETE) for TREK_CHARACTER
app.get('/trek_character', async(req, res) => {
  try {
    const data = await client.query(`
          SELECT  tc.id, tc.name, tc.species, tf.faction AS faction, tc.category, tc.rank, tc.is_carbon_based
          FROM 	  trek_character AS tc
          JOIN 	  trek_faction AS tf
          ON 		  tc.faction = tf.id
    `);
    
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.get('/trek_character/:id', async(req, res) => {
  try {
    const data = await client.query(`
          SELECT  tc.id, tc.name, tc.species, tf.faction AS faction, tc.category, tc.rank, tc.is_carbon_based
          FROM 	  trek_character AS tc
          JOIN 	  trek_faction AS tf
          ON 		  tc.faction = tf.id
          WHERE   tc.id=$1;
        `, [req.params.id]);
        
    
    res.json(data.rows[0]);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.post('/trek_character', async(req, res) => {
  try {
    const data = await client.query(`
          INSERT INTO trek_character (name, species, category, rank, is_carbon_based)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING *`, 
    
    [req.body.name, req.body.species, req.body.category, req.body.rank, req.body.is_carbon_based]);

    
    res.json(data.rows[0])
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

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

app.delete('/trek_character/:id', async(req, res) => {
  try {
    const data = await client.query(`delete from trek_character where id=$1`, [req.params.id]);
    
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

//(GET, POST, PULL, DELETE) for TREK_FACTION
app.get('/trek_faction', async(req, res) => {
  try {
    const data = await client.query('SELECT * from trek_faction');
    
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.get('/trek_faction/:id', async(req, res) => {
  try {
    const data = await client.query(`SELECT * from trek_faction where id=${req.params.id}`);
    
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

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
