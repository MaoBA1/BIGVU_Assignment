import './utilities/fonts.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Screens
import Home from './screens/Home';
import Item from './screens/Item';

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/courseitem/:id" element={<Item/>}/>
        </Routes>
      </Router>
  );
}

export default App;
