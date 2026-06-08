import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import foodImage from './images/dish1.png';
import Apis from './Apis';

function SignUp() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const validateForm = () => {
    const newErrors = {};
    if (!username.trim()) newErrors.username = "Username is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email format";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (!contact) newErrors.contact = "Contact number is required";
    else if (!/^\d{10}$/.test(contact)) newErrors.contact = "Invalid contact number (10 digits required)";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    setServerError("");
//     try {
//       // const response = await axios.post(Apis.SIGN_UP, { username, email, password, contact: Number(contact) });
//       const response = await axios.post(
//     Apis.SIGN_UP, 
//     { username, email, password, contact: Number(contact) },
//     { withCredentials: true } // <--- This is the fix
// );
//       console.log("Response from backend:", response);
//       if (response.data?.userDetail?._id) {
//         navigate("/verify-otp", { state: { email, username } });
//       } else {
//         setServerError("An unexpected error occurred. Please try again.");
//       }
//     } catch (err) {
//       console.log(err); 
//       setServerError(err.response?.data?.message || "Sign up failed. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
try {
      const response = await axios.post(
        Apis.SIGN_UP, 
        { username, email, password, contact: Number(contact) },
        { withCredentials: true }
      );
      
      console.log("Response data payload:", response.data);
      
      // Check for successful HTTP Status Code 201 (Created)
      if (response.status === 201) {
        console.log("Signup success! Redirecting to OTP verification screen...");
        navigate("/verify-otp", { state: { email: email.toLowerCase().trim(), username } });
      } else {
        setServerError("An unexpected error occurred. Please try again.");
      }
    } catch (err) {
      console.log("Signup Error caught:", err); 
      setServerError(err.response?.data?.error || "Sign up failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f4f7f6' }}>
      <Header />
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '100px 20px 40px 20px',
        boxSizing: 'border-box'
      }}>
        {isLoading ? (
          <div>
            <div style={{ border: '4px solid rgba(0,0,0,0.1)', borderLeftColor: '#4CAF50', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite' }}></div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            backgroundColor: '#ffffff',
            borderRadius: '15px',
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            width: '100%',
            maxWidth: '850px'
          }}>

            <div style={{
              flex: '1 1 400px',
              padding: '40px',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}>
              <h2 style={{ marginBottom: '25px', color: '#2c3e50', fontSize: '26px', fontWeight: '600' }}>Create Your Account</h2>
              {serverError && <div style={{ color: '#c0392b', backgroundColor: '#f9e4e4', padding: '10px', borderRadius: '5px', marginBottom: '20px', fontSize: '14px' }}>{serverError}</div>}

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#555' }}>Username</label>
                  <input type="text" placeholder="Enter your Name" value={username} onChange={(e) => setUsername(e.target.value)} style={{ width: '100%', padding: '12px 14px', border: errors.username ? '1px solid #c0392b' : '1px solid #ddd', borderRadius: '8px', fontSize: '15px' }} />
                  {errors.username && <div style={{ color: '#c0392b', fontSize: '13px', marginTop: '4px' }}>{errors.username}</div>}
                </div>
                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#555' }}>Email</label>
                  <input type="email" placeholder="Enter your Email Address" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: '100%', padding: '12px 14px', border: errors.email ? '1px solid #c0392b' : '1px solid #ddd', borderRadius: '8px', fontSize: '15px' }} />
                  {errors.email && <div style={{ color: '#c0392b', fontSize: '13px', marginTop: '4px' }}>{errors.email}</div>}
                </div>
                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#555' }}>Password</label>
                  <input type="password" placeholder="Enter your Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '12px 14px', border: errors.password ? '1px solid #c0392b' : '1px solid #ddd', borderRadius: '8px', fontSize: '15px' }} />
                  {errors.password && <div style={{ color: '#c0392b', fontSize: '13px', marginTop: '4px' }}>{errors.password}</div>}
                </div>
                <div style={{ marginBottom: '25px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500', color: '#555' }}>Contact Number</label>
                  <input type="tel" placeholder="Enter your Contact Number" value={contact} onChange={(e) => setContact(e.target.value.replace(/\D/g, '').slice(0, 10))} style={{ width: '100%', padding: '12px 14px', border: errors.contact ? '1px solid #c0392b' : '1px solid #ddd', borderRadius: '8px', fontSize: '15px' }} />
                  {errors.contact && <div style={{ color: '#c0392b', fontSize: '13px', marginTop: '4px' }}>{errors.contact}</div>}
                </div>
                <button type="submit" disabled={isLoading} style={{ width: '100%', padding: '14px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '16px', opacity: isLoading ? 0.7 : 1 }}>
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>
                <p style={{ marginLeft: "50px" }}>Already have an Account?{' '}<span onClick={() => navigate('/sign-in')}style={{ color: '#4CAF50', fontWeight: '400', cursor: 'pointer', textDecoration: 'underline' }}>Sign-In</span></p>
              </form>
            </div>
            <div style={{
              flex: '1 1 400px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              boxSizing: 'border-box',
              background: 'linear-gradient(135deg, #e8f5e9, #f4f7f6)'
            }}>
              <img src={foodImage} alt="Healthy Food" style={{ width: '100%', maxWidth: '350px', height: 'auto', objectFit: 'contain' }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SignUp;