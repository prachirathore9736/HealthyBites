import React, { useState } from 'react';
import './ResetPassword.css';
import Header from './Header';
import axios from 'axios';
import forgetImage from "./images/forgot1.png";
import Apis from './Apis';
import { useNavigate } from 'react-router-dom';

function ResetPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      return setMessage("Passwords do not match");
    }

    try {
      const res = await axios.post(Apis.RESET_PASSWORD, {
        email,
        newPassword,
        confirmPassword
      });

      setMessage(res.data.message);
      if (res.data.message === "Password updated successfully") {
        setMessage("Password updated. Redirecting to Sign In...");
        setTimeout(() => navigate("/sign-in"), 1000);
      }

    } catch (error) {
      console.error("Reset Error:", error);
      setMessage(error.response?.data?.message || "Something went wrong");
    }
  };
  return <>
    <Header />
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: "auto", backgroundColor: 'white', padding: "100px 10px" }}>
      <div style={{ display: 'flex', backgroundColor: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', width: '70%', maxWidth: '850px', maxHeight: "450px" }}>
        <div className="reset-form-container">
          <h1>Reset Your Password</h1>
          <form onSubmit={handleReset} className="reset-form">
            <div className="form-group">
              <label>Email</label>
              <input onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Enter your Email Address" />
            </div>
            <div className="form-group">
              <label>New Password</label>
              <input onChange={(e) => setNewPassword(e.target.value)} type="password" placeholder="Enter your New Password" required />
            </div>
            <div className='form-group'>
              <label className='form-group'>Confirm Password</label>
              <input onChange={(e) => setConfirmPassword(e.target.value)} type="password" placeholder="Confirm your Password" />
            </div>
            <br />
            <button type="submit" className="reset-btn">Reset Password</button>
            {message && <p style={{ marginTop: "10px", color: "green" }}>{message}</p>}
          </form>
        </div>
        <div style={{ flex: 1 }}>
          <img src={forgetImage} alt="Delicious Dish" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: "10px" }} />
        </div>
      </div>
    </div>
  </>
};

export default ResetPassword;
