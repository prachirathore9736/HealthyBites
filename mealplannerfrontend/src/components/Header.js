import './Header.css';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="main-header">
      <div className="header-left">
        <img src="logo.png" alt="App Logo" className="logo-img" />
      </div>

      <nav className="header-right">
        <Link to="/meal" className="explore-link">Explore</Link>
        <Link to="/sign-up" className="auth-btn">Sign Up</Link>
        <Link to="/sign-in" className="auth-btn">Sign In</Link>
      </nav>
    </header>
  );
}

export default Header;
