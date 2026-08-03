import Editor from '@monaco-editor/react';
import { useEffect, useMemo, useState } from 'react';
import { api } from '../api';
import { DEFAULT_CODE, LANGUAGE_OPTIONS } from '../data/languages';

function ProblemPage({ problemId }) {
  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState('python');
  const [codeByLanguage, setCodeByLanguage] = useState(DEFAULT_CODE);
  const [runResults, setRunResults] = useState([]);
  const [submitResult, setSubmitResult] = useState(null);
  const [submitCaseResults, setSubmitCaseResults] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const { data } = await api.get(`/problems/${problemId}`);
        setProblem(data);
      } catch {
        setError('Unable to load problem.');
      }
    };

    fetchProblem();
  }, [problemId]);

  const sourceCode = useMemo(() => codeByLanguage[language], [codeByLanguage, language]);

  const updateCode = (nextCode = '') => {
    setCodeByLanguage((previous) => ({ ...previous, [language]: nextCode }));
  };

  const runCode = async () => {
    setSubmitResult(null);
    setSubmitCaseResults([]);
    setError('');

    try {
      const { data } = await api.post('/submissions/run', {
        language,
        sourceCode,
        testCases: problem.sampleTestCases,
      });
      setRunResults(data.results);
    } catch {
      setError('Run failed. Check your code and try again.');
    }
  };

  const submitCode = async () => {
    setSubmitResult(null);
    setRunResults([]);
    setSubmitCaseResults([]);
    setError('');

    try {
      const { data } = await api.post('/submissions/submit', {
        problemId,
        language,
        sourceCode,
      });
      setSubmitResult(data);
      setSubmitCaseResults(data.caseResults || []);
    } catch {
      setError('Submit failed. Try again.');
    }
  };

  if (error && !problem) {
    return <p className="text-rose-600">{error}</p>;
  }

  if (!problem) {
    return <p>Loading problem...</p>;
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
      <section className="space-y-4 rounded-lg border border-slate-200 bg-white p-4">
        <h1 className="text-2xl font-semibold">{problem.title}</h1>
        <p className="whitespace-pre-wrap text-slate-700">{problem.statement}</p>
        <div>
          <h2 className="mb-2 text-lg font-medium">Constraints</h2>
          <p className="whitespace-pre-wrap text-slate-700">{problem.constraints}</p>
        </div>
        <div className="space-y-3">
          <h2 className="text-lg font-medium">Samples</h2>
          {problem.sampleTestCases.map((sample, index) => (
            <article key={`${sample.input}-${index}`} className="rounded border border-slate-200 p-3 text-sm">
              <p>
                <span className="font-medium">Input:</span> {sample.input}
              </p>
              <p>
                <span className="font-medium">Output:</span> {sample.output}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-sm font-medium" htmlFor="language">
            Language
          </label>
          <select
            id="language"
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
            className="rounded border border-slate-300 px-3 py-2 text-sm"
          >
            {LANGUAGE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={runCode}
            className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white"
          >
            Run
          </button>
          <button
            type="button"
            onClick={submitCode}
            className="rounded bg-emerald-600 px-4 py-2 text-sm font-medium text-white"
          >
            Submit
          </button>
          {submitResult ? <p className="text-sm font-semibold text-indigo-700">{submitResult.verdict}</p> : null}
        </div>

        <Editor
          height="440px"
          language={language === 'cpp' ? 'cpp' : language}
          value={sourceCode}
          theme="vs-dark"
          onChange={updateCode}
          options={{ minimap: { enabled: false }, fontSize: 14 }}
        />

        {error ? <p className="text-sm text-rose-600">{error}</p> : null}

        <div className="space-y-2">
          {submitResult ? (
            <div className="rounded border border-indigo-200 bg-indigo-50 p-3 text-sm">
              <p>
                <span className="font-medium">Submit verdict:</span> {submitResult.verdict}
              </p>
              {submitResult.testedAgainst ? (
                <p className="whitespace-pre-wrap">
                  <span className="font-medium">Checked against:</span> {submitResult.testedAgainst} test cases
                </p>
              ) : null}
              {submitResult.status ? (
                <p className="whitespace-pre-wrap">
                  <span className="font-medium">Status:</span> {submitResult.status}
                </p>
              ) : null}
              {submitResult.failedTestCase ? (
                <p>
                  <span className="font-medium">Failed hidden test case:</span> #{submitResult.failedTestCase}
                </p>
              ) : null}
              <p className="whitespace-pre-wrap">
                <span className="font-medium">Output:</span> {submitResult.output || '(empty)'}
              </p>
              {submitResult.stderr ? (
                <p className="whitespace-pre-wrap">
                  <span className="font-medium">Runtime error:</span> {submitResult.stderr}
                </p>
              ) : null}
              {submitResult.compileOutput ? (
                <p className="whitespace-pre-wrap">
                  <span className="font-medium">Compilation error:</span> {submitResult.compileOutput}
                </p>
              ) : null}
            </div>
          ) : null}
          {submitCaseResults.length > 0 ? (
            <div className="rounded border border-indigo-200 bg-indigo-50 p-3 text-sm">
              <p className="mb-2 font-medium">Testcase Output</p>
              {submitCaseResults.map((result) => (
                <div key={`submit-case-${result.testCase}`} className="mb-3 rounded border border-indigo-100 bg-white p-3 last:mb-0">
                  <p>
                    <span className="font-medium">Test case {result.testCase}:</span> {result.verdict}
                  </p>
                  <p className="whitespace-pre-wrap">
                    <span className="font-medium">Status:</span> {result.status}
                  </p>
                  {'input' in result ? (
                    <p className="whitespace-pre-wrap">
                      <span className="font-medium">Input:</span> {result.input}
                    </p>
                  ) : null}
                  {'expectedOutput' in result ? (
                    <p className="whitespace-pre-wrap">
                      <span className="font-medium">Expected:</span> {result.expectedOutput}
                    </p>
                  ) : null}
                  <p className="whitespace-pre-wrap">
                    <span className="font-medium">Output:</span> {result.output || '(empty)'}
                  </p>
                  {result.stderr ? (
                    <p className="whitespace-pre-wrap">
                      <span className="font-medium">Runtime error:</span> {result.stderr}
                    </p>
                  ) : null}
                  {result.compileOutput ? (
                    <p className="whitespace-pre-wrap">
                      <span className="font-medium">Compilation error:</span> {result.compileOutput}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}
          {runResults.map((result, index) => (
            <div key={`${result.input}-${index}`} className="rounded border border-slate-200 p-3 text-sm">
              <p>
                <span className="font-medium">Sample {index + 1}:</span> {result.verdict}
              </p>
              <p className="whitespace-pre-wrap">
                <span className="font-medium">Status:</span> {result.status}
              </p>
              <p className="whitespace-pre-wrap">
                <span className="font-medium">Output:</span> {result.output || '(empty)'}
              </p>
              <p className="whitespace-pre-wrap">
                <span className="font-medium">Expected:</span> {result.expectedOutput}
              </p>
              {result.stderr ? (
                <p className="whitespace-pre-wrap">
                  <span className="font-medium">Runtime error:</span> {result.stderr}
                </p>
              ) : null}
              {result.compileOutput ? (
                <p className="whitespace-pre-wrap">
                  <span className="font-medium">Compilation error:</span> {result.compileOutput}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default ProblemPage;
