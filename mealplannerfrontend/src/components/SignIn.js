import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from './Header';
import foodPlate from './images/dish5.jpg';
import Apis from './Apis';
import axios from 'axios';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from '../firebase';

function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // const handleGoogleLogin = async () => {
  //   setError("");
  //   try {
  //     const provider = new GoogleAuthProvider();
  //     const result = await signInWithPopup(auth, provider);
  //     const user = result.user;
  //     const idToken = await user.getIdToken();

  //     const response = await fetch("http://localhost:3000/user/google-login", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       credentials: "include",
  //       body: JSON.stringify({ token: idToken })
  //     });

  //     const data = await response.json();

  //     if (response.ok) {
  //       sessionStorage.setItem("current-user", JSON.stringify({
  //         email: data.user.email,
  //         username: data.user.username,
  //         role: data.user.role
  //       }));
  //       localStorage.setItem("token", data.token);

  //       if (data.user.role === "admin") {
  //         navigate("/admin-dashboard");
  //       } else if (data.user.role === "user") {
  //         if (data.firstTime) {
  //           navigate("/welcome");
  //         } else if (data.profileComplete) {
  //           navigate("/dashboard");
  //         } else {
  //           navigate("/profile-setup", {
  //             state: { email: data.user.email, token: data.token }
  //           });
  //         }
  //       } else {
  //         setError("Unknown role detected.");
  //       }

  //     } else {
  //       setError(data.error || "Google login failed.");
  //     }

  //   } catch (error) {
  //     console.error("Google login error:", error);
  //     setError("Google login failed. Please try again.");
  //   }
  // };



  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        Apis.SIGN_IN,
        { email, password },
        { withCredentials: true }
      );

      const { token, user, profileComplete } = response.data;

      if (!user || !token) {
        setError("Invalid server response. Please try again.");
        return;
      }

      // save user session
      sessionStorage.setItem("current-user", JSON.stringify({
        email: user.email,
        username: user.username,
        role: user.role,
        profileComplete
      }));

      if (token) {
        localStorage.setItem("token", token);
      }

      // role based redirect
      if (user.role === "admin") {
        navigate("/admin-dashboard");
      } else if (user.role === "user") {
        if (profileComplete) {
          navigate("/dashboard");
        } else {
          navigate("/profile-setup", {
            state: { email: user.email, token }
          });
        }
      } else {
        setError("Unknown role detected. Please contact support.");
      }

    } catch (err) {
      console.error("Sign In Error:", err);
      setError(err.response?.data?.error || "Sign in failed. Please try again.");
    }
  };


  return (
    <>
      <Header />
      <div style={{
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fefefe',
        fontFamily: 'Segoe UI, sans-serif'
      }}>
        <div style={{
          marginTop: "60px",
          display: 'flex',
          maxWidth: '750px',
          width: '100%',
          height: '450px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          borderRadius: '15px',
          overflow: 'hidden',
          backgroundColor: '#fff'
        }}>
          <div style={{
            flex: 0.7,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden'
          }}>
            <img
              src={foodPlate}
              alt="Dish"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>

          <div style={{
            flex: 1.2,
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            overflowY: 'auto'
          }}>
            <h2 style={{
              textAlign: 'center',
              marginBottom: '15px',
              color: '#333',
              fontSize: '20px'
            }}>
              Welcome Back! Let's Plan Your Meals
            </h2>

            {error && (
              <div style={{
                color: 'red',
                backgroundColor: '#ffeeee',
                padding: '8px',
                borderRadius: '5px',
                marginBottom: '15px',
                textAlign: 'center',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your Email"
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '6px',
                    border: '1px solid #ccc',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your Password"
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '6px',
                    border: '1px solid #ccc',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ textAlign: 'right' }}>
                <Link to="/forgot-password" style={{ fontSize: '13px', color: 'blue' }}>
                  Forget Password?
                </Link>
              </div>

              <button
                type="submit"
                style={{
                  padding: '10px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '20px',
                  fontSize: '15px',
                  cursor: 'pointer',
                  width: '60%',
                  alignSelf: 'center'
                }}
              >
                Sign In
              </button>

              {/*<div style={{ margin: '8px 0', textAlign: 'center' }}>
                <hr style={{ margin: '10px 0' }} />
                <span style={{ fontSize: '13px', color: '#888' }}>or</span>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  padding: '10px',
                  backgroundColor: '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  width: '60%',
                  alignSelf: 'center'
                }}
              >
                <img
                  src="https://developers.google.com/identity/images/g-logo.png"
                  alt="Google"
                  style={{ width: '18px', height: '18px' }}
                />
                Sign in with Google
              </button>*/}
            </form>

            <p style={{
              marginTop: '15px',
              textAlign: 'center',
              fontSize: '13px',
              color: '#555'
            }}>
              Don't have an Account?{' '}
              <Link to="/sign-up" style={{ color: '#4CAF50', fontWeight: 'bold' }}>
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignIn;