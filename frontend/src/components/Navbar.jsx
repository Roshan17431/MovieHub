import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import './Navbar.css';

function Navbar({ onSearch }) {
  const navigate = useNavigate();
  const isAuthenticated = authService.isAuthenticated();
  const isAdmin = authService.isAdmin();
  const userInfo = authService.getUserInfo();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const handleSearchChange = (e) => {
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          🎬 MovieHub
        </Link>
        
        {isAuthenticated && (
          <>
            <div className="navbar-search">
              <input
                type="text"
                placeholder="Search movies..."
                onChange={handleSearchChange}
                className="search-input"
              />
            </div>

            <div className="navbar-menu">
              <Link to="/movies" className="navbar-link">
                Movies
              </Link>
              
              {isAdmin && (
                <Link to="/admin" className="navbar-link admin-link">
                  Admin Panel
                </Link>
              )}
              
              <div className="navbar-user">
                <span className="user-email">{userInfo?.email}</span>
                <button onClick={handleLogout} className="btn-logout">
                  Logout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
