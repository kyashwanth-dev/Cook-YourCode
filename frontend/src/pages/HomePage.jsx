import { useEffect, useState } from 'react';
import { api } from '../api';

const difficultyStyles = {
  Easy: 'text-emerald-700 bg-emerald-100',
  Medium: 'text-amber-700 bg-amber-100',
  Hard: 'text-rose-700 bg-rose-100',
};

function HomePage() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data } = await api.get('/problems');
        setProblems(data);
      } catch {
        setError('Unable to load problems.');
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-semibold">Coding Problems</h1>
      {loading ? <p>Loading problems...</p> : null}
      {error ? <p className="text-rose-600">{error}</p> : null}
      <div className="grid gap-3">
        {problems.map((problem) => (
          <a
            key={problem.id}
            href={`/problems/${problem.id}`}
            className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 shadow-sm hover:border-slate-300"
          >
            <span className="font-medium">{problem.title}</span>
            <span className={`rounded-full px-3 py-1 text-sm ${difficultyStyles[problem.difficulty]}`}>
              {problem.difficulty}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

export default HomePage;
