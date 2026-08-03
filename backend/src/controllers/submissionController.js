const mongoose = require('mongoose');
const Problem = require('../models/problem');
const { runCode } = require('../services/judge0');

const normalizeText = (value = '') => value.replace(/\r\n/g, '\n').trimEnd();
const toObjectId = (id) => new mongoose.Types.ObjectId(id);

const toRunResult = (verdict, result, expectedOutput) => ({
  verdict,
  output: result.stdout || '',
  expectedOutput,
  status: result.status?.description || 'Unknown',
  stderr: result.stderr || '',
  compileOutput: result.compile_output || '',
});

const toCaseResult = ({ index, run, testCase, includeSensitive }) => ({
  testCase: index + 1,
  verdict: run.verdict,
  status: run.status,
  output: run.output,
  stderr: run.stderr,
  compileOutput: run.compileOutput,
  ...(includeSensitive ? { input: testCase.input, expectedOutput: run.expectedOutput } : {}),
});

const evaluateSingleCase = async ({ sourceCode, language, testCase }) => {
  const result = await runCode({ sourceCode, language, stdin: testCase.input });

  if (result.compile_output) {
    return toRunResult('Compilation Error', result, testCase.output);
  }

  if (result.stderr) {
    return toRunResult('Runtime Error', result, testCase.output);
  }

  const actual = normalizeText(result.stdout || '');
  const expected = normalizeText(testCase.output || '');

  if (actual !== expected) {
    return toRunResult('Wrong Answer', result, testCase.output);
  }

  return toRunResult('Accepted', result, testCase.output);
};

const runSampleCases = async (req, res, next) => {
  try {
    const { sourceCode, language, testCases = [] } = req.body;

    const results = [];
    for (const testCase of testCases) {
      // eslint-disable-next-line no-await-in-loop
      const run = await evaluateSingleCase({ sourceCode, language, testCase });
      results.push({ input: testCase.input, ...run });
    }

    res.json({ results });
  } catch (error) {
    next(error);
  }
};

const submitSolution = async (req, res, next) => {
  try {
    const { problemId, sourceCode, language } = req.body;

    if (!mongoose.isValidObjectId(problemId)) {
      return res.status(400).json({ message: 'Invalid problem id' });
    }

    const problem = await Problem.findOne({ _id: toObjectId(problemId) }).select('+hiddenTestCases');

    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    const hasHiddenTestCases = problem.hiddenTestCases.length > 0;
    const testCasesToEvaluate = hasHiddenTestCases ? problem.hiddenTestCases : problem.sampleTestCases;

    if (testCasesToEvaluate.length === 0) {
      return res.status(400).json({ message: 'Problem has no test cases configured' });
    }

    let lastRun = null;
    const caseResults = [];
    const includeSensitive = !hasHiddenTestCases;

    for (let index = 0; index < testCasesToEvaluate.length; index += 1) {
      const testCase = testCasesToEvaluate[index];
      // eslint-disable-next-line no-await-in-loop
      const run = await evaluateSingleCase({ sourceCode, language, testCase });
      lastRun = run;
      caseResults.push(toCaseResult({ index, run, testCase, includeSensitive }));

      if (run.verdict !== 'Accepted') {
        return res.json({
          verdict: run.verdict,
          status: run.status,
          output: run.output,
          stderr: run.stderr,
          compileOutput: run.compileOutput,
          failedTestCase: index + 1,
          testedAgainst: hasHiddenTestCases ? 'hidden' : 'sample',
          caseResults,
        });
      }
    }

    return res.json({
      verdict: 'Accepted',
      status: hasHiddenTestCases ? 'All hidden test cases passed' : 'All sample test cases passed',
      output: lastRun?.output || '',
      stderr: '',
      compileOutput: '',
      testedAgainst: hasHiddenTestCases ? 'hidden' : 'sample',
      caseResults,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  runSampleCases,
  submitSolution,
};
