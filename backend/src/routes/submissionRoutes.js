const express = require('express');
const { runSampleCases, submitSolution } = require('../controllers/submissionController');
const { apiRateLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

router.use(apiRateLimiter);
router.post('/run', runSampleCases);
router.post('/submit', submitSolution);

module.exports = router;
