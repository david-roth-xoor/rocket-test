import './App.css';
import Dashboard from './components/Dashboard';
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import Details from './components/Detail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/details/:id" element={<Details />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
