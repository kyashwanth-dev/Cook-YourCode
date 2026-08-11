import { useState } from 'react';
import { api } from '../api';

const defaultProblem = {
  title: '',
  difficulty: 'Easy',
  statement: '',
  constraints: '',
  sampleRaw: '',
  hiddenRaw: '',
  id: '',
};

const parseTestCases = (raw) =>
  raw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [input, ...outputParts] = line.split('|');
      return { input: input?.trim() || '', output: outputParts.join('|').trim() };
    })
    .filter((testCase) => testCase.input && testCase.output);

function AdminPage() {
  const [form, setForm] = useState(defaultProblem);
  const [status, setStatus] = useState('');

  const updateField = (field, value) => {
    setForm((previous) => ({ ...previous, [field]: value }));
  };

  const submit = async (event) => {
    event.preventDefault();

    const payload = {
      title: form.title,
      difficulty: form.difficulty,
      statement: form.statement,
      constraints: form.constraints,
      sampleTestCases: parseTestCases(form.sampleRaw),
      hiddenTestCases: parseTestCases(form.hiddenRaw),
    };

    try {
      if (form.id.trim()) {
        await api.put(`/problems/admin/${form.id.trim()}`, payload);
        setStatus('Problem updated successfully.');
      } else {
        await api.post('/problems/admin', payload);
        setStatus('Problem created successfully.');
        setForm(defaultProblem);
      }
    } catch (error) {
      const message = error?.response?.data?.message;
      setStatus(message || 'Unable to save problem. Check input and try again.');
    }
  };

  return (
    <section className="mx-auto max-w-3xl space-y-4 rounded-lg border border-slate-200 bg-white p-6">
      <h1 className="text-2xl font-semibold">Admin Panel</h1>
      <p className="text-sm text-slate-600">
        Use one test case per line in <span className="font-medium">input|output</span> format.
      </p>
      <form className="grid gap-4" onSubmit={submit}>
        <input
          value={form.id}
          onChange={(event) => updateField('id', event.target.value)}
          placeholder="Problem ID (fill only to edit existing problem)"
          className="rounded border border-slate-300 px-3 py-2"
        />
        <input
          required
          value={form.title}
          onChange={(event) => updateField('title', event.target.value)}
          placeholder="Title"
          className="rounded border border-slate-300 px-3 py-2"
        />
        <select
          value={form.difficulty}
          onChange={(event) => updateField('difficulty', event.target.value)}
          className="rounded border border-slate-300 px-3 py-2"
        >
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
        <textarea
          required
          value={form.statement}
          onChange={(event) => updateField('statement', event.target.value)}
          placeholder="Problem statement"
          rows={6}
          className="rounded border border-slate-300 px-3 py-2"
        />
        <textarea
          required
          value={form.constraints}
          onChange={(event) => updateField('constraints', event.target.value)}
          placeholder="Constraints"
          rows={3}
          className="rounded border border-slate-300 px-3 py-2"
        />
        <textarea
          value={form.sampleRaw}
          onChange={(event) => updateField('sampleRaw', event.target.value)}
          placeholder="Sample test cases (input|output)"
          rows={4}
          className="rounded border border-slate-300 px-3 py-2"
        />
        <textarea
          value={form.hiddenRaw}
          onChange={(event) => updateField('hiddenRaw', event.target.value)}
          placeholder="Hidden test cases (input|output)"
          rows={4}
          className="rounded border border-slate-300 px-3 py-2"
        />
        <button type="submit" className="rounded bg-slate-900 px-4 py-2 font-medium text-white">
          Save Problem
        </button>
      </form>
      {status ? <p className="text-sm font-medium text-indigo-700">{status}</p> : null}
    </section>
  );
}

export default AdminPage;
