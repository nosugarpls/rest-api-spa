const express = require('express');
const app = express();
const items = require('./itemDB');

app.use(express.static('./public'));

app.get('/items/:name', express.json(), (req, res) => {
  const name = req.params.name;
  if (!name) {
    res.status(400).json({
      error: 'missing-name'
    });
    return;
  }
  if (!items[name]) {
    res.status(404).json({
      error: `Unknown item: ${name}`
    });
    return;
  }
  res.json(items[name]);
});

app.get('/items/', express.json(), (req, res) => {
  res.json(Object.values(items));
});

app.post('/items/', express.json(), (req, res) => {
  const name = req.body.name;
  if (!name) {
    res.status(400).json({
      error: 'missing-name'
    });
    return;
  }
  if (items[name]) {
    res.status(409).json({
      error: 'duplicate'
    });
    return;
  }
  items[name] = req.body;
  res.json(Object.values(items));
});

app.delete('/items/:name', express.json(), (req, res) => {
  const name = req.params.name;
  if (!name) {
    res.status(400).json({
      error: 'missing-name'
    });
    return;
  }
  if (!items[name]) {
    res.status(404).json({
      error: `Unknown item: ${name}`
    });
    return;
  }
  delete items[name];
  res.json(Object.values(items));
});

app.put('/items/:name', express.json(), (req, res) => {
  const name = req.params.name;
  if (!name) {
    res.status(400).json({
      error: 'missing-name'
    });
    return;
  }
  if (!items[name]) {
    res.status(404).json({
      error: `Unknown item: ${name}`
    });
    return;
  }
  items[name] = req.body;
  res.json(Object.values(items));
});

app.listen(3000, () => console.log('running'));