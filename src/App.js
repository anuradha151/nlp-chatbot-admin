import './App.css';
import CreateTag from './pages/CreateTag';
import Home from './pages/Home';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

function App() {
  return (
  <>
            
            <Router>
                <Routes>
                    <Route
                        exact
                        path="/"
                        element={<Home />}
                    />
                    <Route
                        path="/create-tag"
                        element={<CreateTag />}
                    />
                    <Route
                        path="*"
                        element={<Navigate to="/" />}
                    />
                </Routes>
            </Router>
        </>
  );
}

export default App;
