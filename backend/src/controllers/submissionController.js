const Problem = require('../models/problem');
const { runCode } = require('../services/judge0');

const normalizeText = (value = '') => value.replace(/\r\n/g, '\n').trimEnd();

const toRunResult = (verdict, result, expectedOutput) => ({
  verdict,
  output: result.stdout || '',
  expectedOutput,
  status: result.status?.description || 'Unknown',
  stderr: result.stderr || '',
  compileOutput: result.compile_output || '',
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

    const problem = await Problem.findById(problemId).select('+hiddenTestCases');

    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    for (const testCase of problem.hiddenTestCases) {
      // eslint-disable-next-line no-await-in-loop
      const run = await evaluateSingleCase({ sourceCode, language, testCase });

      if (run.verdict !== 'Accepted') {
        return res.json({ verdict: run.verdict, status: run.status });
      }
    }

    return res.json({ verdict: 'Accepted', status: 'All hidden test cases passed' });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  runSampleCases,
  submitSolution,
};
