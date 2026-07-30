const express = require('express');
const { runSampleCases, submitSolution } = require('../controllers/submissionController');

const router = express.Router();

router.post('/run', runSampleCases);
router.post('/submit', submitSolution);

module.exports = router;
