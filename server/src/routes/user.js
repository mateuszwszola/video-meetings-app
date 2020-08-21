const router = require('express').Router();

router.get('/', (req, res, next) => {
  res.json({ message: 'User router' });
});

module.exports = router;
