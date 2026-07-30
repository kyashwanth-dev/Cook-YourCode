const express = require('express');
const { getProblem, listProblems, upsertProblem } = require('../controllers/problemController');
const { apiRateLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.use(apiRateLimiter);
router.get('/', listProblems);
router.get('/:id', getProblem);
router.post('/admin', upsertProblem);
router.put('/admin/:id', upsertProblem);

module.exports = router;
