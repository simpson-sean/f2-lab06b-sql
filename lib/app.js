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

app.get('/trek', async(req, res) => {
  try {
    const data = await client.query('SELECT * from trek');
    
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.get('/trek/:id', async(req, res) => {
  try {
    const data = await client.query(`SELECT * from trek where id=${req.params.id}`);
    
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.post('/trek', async(req, res) => {
  try {
    const data = await client.query(`
      INSERT INTO trek (name, species, faction, category, rank, is_carbon_based)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`, 
      [req.body.name, req.body.species, req.body.faction, req.body.category, req.body.rank, req.body.is_carbon_based]);


    res.json(data.rows[0]);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.put('/trek/:id', async(req, res) => {
  try {
    const data = await client.query(`
      UPDATE trek
      SET name=$1,
      species=$2,
      faction=$3,
      category=$4,
      rank=$5,
      is_carbon_based=$6
      WHERE id=$7
      RETURNING *
      `, 
      [req.body.name, req.body.species, req.body.faction, req.body.category, req.body.rank, req.body.is_carbon_based, req.params.id]);
    
    res.json(data.rows[0]);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.delete('/trek/:id', async(req, res) => {
  try {
    const data = await client.query(`delete from trek where id=$1`, [req.params.id]);
    
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.use(require('./middleware/error'));

module.exports = app;
