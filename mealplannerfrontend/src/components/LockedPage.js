import React from 'react';
import './LockedPage.css';
import lockImage from './images/lock.png';
import { Link } from 'react-router-dom';
import Header from './Header';

function LockedPage() {
  return <>
    <Header />
    <div className="lock-page-container">

      <h1>View Our Meals for the Week</h1>
      <p>Please sign up to access this page and unlock meal suggestions tailored just for you.</p>

      <img src={lockImage} alt="Lock and confused user" className="lock-illustration" />

      <Link to="/sign-up" className="signup-btn">Sign-Up</Link>
    </div>
  </>
}

export default LockedPage;
