import React from 'react';
import { Link } from 'react-router-dom';

function WelcomeHeader() {
  return (
    <header style={{
      backgroundColor: 'white',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      padding: '15px 30px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div className="logo">
        <img src="logo.png" alt="Healthy Bites Logo" style={{ height: '40px' }} />
      </div>
      <div style={{ display: 'flex', gap: '15px' }}>
        <Link to="/profile-setup" style={{
          padding: '8px 20px',
          backgroundColor: '#4CAF50',
          color: 'white',
          borderRadius: '20px',
          textDecoration: 'none',
          fontWeight: '600'
        }}>
          Complete Profile
        </Link>
      </div>
    </header>
  );
}

export default WelcomeHeader;