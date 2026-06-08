import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Apis from './Apis';
import Header from './Header';

function VerifyOTP() {
  const location = useLocation();
  const navigate = useNavigate();
  const { email, username } = location.state || {};

  const [otp, setOtp] = useState(Array(6).fill(''));
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const inputs = useRef([]);

  const handleChange = (index, value) => {
    if (!isNaN(value) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        inputs.current[index + 1].focus();
      }
    }
  };

  const handleBackspace = (index, event) => {
    if (event.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');

    try {
      const res = await axios.post(
        Apis.VERIFY_OTP,
        { email, otp: otpCode },
        { withCredentials: true } // for cookies
      );

      setMessage(res.data.message);
      setError('');

      navigate("/welcome", {
        state: {
          email,
          username,
          token: res.data.token
        }
      });
    } catch (err) {
      setMessage('');
      setError(err.response?.data?.error || 'Failed to verify OTP');
    }
  };

  const handleResend = async () => {
    try {
      const res = await axios.post(Apis.RESEND_OTP, { email });
      setMessage(res.data.message);
      setError('');
      setOtp(Array(6).fill(''));
      alert("OTP resent to your email");
    } catch (err) {
      setMessage('');
      setError(err.response?.data?.error || 'Failed to resend OTP');
    }
  };

  return (
    <>
      <Header />
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f7f9fa',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px'
      }}>
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '16px',
          padding: '40px 30px',
          maxWidth: '420px',
          width: '100%',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <h2 style={{ marginBottom: '10px', color: '#333' }}>Verify Your Email</h2>
          <p style={{ marginBottom: '25px', fontSize: '15px', color: '#666' }}>
            Enter the 6-digit OTP sent to {email}
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '12px',
              marginBottom: '25px'
            }}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={digit}
                  ref={(el) => inputs.current[index] = el}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleBackspace(index, e)}
                  style={{
                    width: '48px',
                    height: '55px',
                    fontSize: '22px',
                    border: '2px solid #ddd',
                    borderRadius: '10px',
                    textAlign: 'center',
                    outline: 'none',
                    transition: '0.2s',
                  }}
                  onFocus={(e) => e.target.style.border = '2px solid #4CAF50'}
                  onBlur={(e) => e.target.style.border = '2px solid #ddd'}
                />
              ))}
            </div>

            <button type="submit" style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              fontSize: '16px',
              borderRadius: '10px',
              cursor: 'pointer',
              transition: '0.3s'
            }}>
              Verify OTP
            </button>
          </form>

          <p style={{ marginTop: '20px', fontSize: '14px', color: '#555' }}>
            Didn't receive OTP?{' '}
            <span
              onClick={handleResend}
              style={{
                color: '#4CAF50',
                textDecoration: 'underline',
                cursor: 'pointer'
              }}
            >
              Resend
            </span>
          </p>

          {error && (
            <div style={{
              color: '#e74c3c',
              marginTop: '15px',
              padding: '10px',
              backgroundColor: '#fdeded',
              borderRadius: '5px'
            }}>
              {error}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default VerifyOTP;