import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './UserHeader.css'; // External CSS for cleaner styles

function UserHeader() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('today');

  return (
    <header className="user-header">
      <div className="logo">
        <img src="logo.png" alt="Logo" />
      </div>
      <div className="profile-button">
        <button onClick={() => navigate('/sign-in')}>Logout</button>
        <button onClick={() => navigate('/user-profile')}>My Profile</button>
      </div>
    </header>
  );
}

export default UserHeader;
