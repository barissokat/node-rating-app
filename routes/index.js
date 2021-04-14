const express = require('express');
const router = express.Router();

// Do work here
router.get('/', (req, res) => {
  res.send('Hey! It works!');
});

router.get('/reverse/:name', (req, res) => {
  const reverse = [...req.params.name].reverse().join('');
  res.send(reverse);
})

router.get('/pug', (req, res) => {
  res.render('hello', {
    name: req.query.dog,
    age: 5
  });
});

module.exports = router;
