import Layout from './components/Layout';
import AdminPage from './pages/AdminPage';
import HomePage from './pages/HomePage';
import ProblemPage from './pages/ProblemPage';

const getProblemId = (pathname) => {
  const match = pathname.match(/^\/problems\/([^/]+)$/);
  return match ? match[1] : null;
};

function App() {
  const currentPath = window.location.pathname;
  const problemId = getProblemId(currentPath);

  let content = <HomePage />;

  if (currentPath === '/admin') {
    content = <AdminPage />;
  } else if (problemId) {
    content = <ProblemPage problemId={problemId} />;
  }

  return <Layout currentPath={currentPath}>{content}</Layout>;
}

export default App;
