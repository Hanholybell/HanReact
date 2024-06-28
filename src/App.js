import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import EntryPage from './EntryPage';
import MainPage from './MainPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<EntryPage />} />
        <Route path="/main" element={<MainPage />} />
      </Routes>
    </Router>
  );
}

export default App;
