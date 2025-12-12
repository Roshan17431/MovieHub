import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import './Home.css';

function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>Welcome to MovieHub</h1>
        <button onClick={handleLogout} className="btn-logout">
          Logout
        </button>
      </div>
      <div className="home-content">
        <div className="success-message">
          <h2>✓ Successfully Authenticated!</h2>
          <p>You are now logged in to MovieHub.</p>
          <p>Your JWT token is stored and will be automatically attached to API requests.</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
