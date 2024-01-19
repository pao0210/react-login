import './App.css';
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';

function App() {
  return (
    <div className="App">
      <div className="vh-100 d-flex justify-content-center align-items-center align-self-end">
      <h1>Home</h1>
      <br />
      <Link to="/login"><Button variant="contained">Login</Button></Link>
      <Link to="/register"><Button variant="contained">Register</Button></Link>
      </div>
    </div>
  );
}

export default App;
