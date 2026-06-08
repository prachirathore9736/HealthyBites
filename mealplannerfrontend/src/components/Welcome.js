import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const WelcomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, username } = location.state || {};
  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem("current-user"));

    if (!userData) {
      navigate('/sign-in');
      return;
    }

    if (userData.profileComplete) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleProfileSetup = () => {
    navigate('/profile', {
      state: {
        token: localStorage.getItem('token')
      }
    });
  };

  const handleExploreMeals = () => {
    navigate('/meal-planner');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e4edf5 100%)',
      padding: '0px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0px'
      }}>
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 0',
          borderBottom: '1px solid rgba(0,0,0,0.1)'
        }}>
          <div className="logo">
            <img src="logo.png" alt="Logo" />
          </div>
          <button onClick={() => navigate('/profile')} style={{
            padding: '8px 20px',
            backgroundColor: 'transparent',
            border: '1px solid #4CAF50',
            borderRadius: '20px',
            color: '#4CAF50',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }} onMouseOver={e => {
            e.target.style.backgroundColor = '#4CAF50';
            e.target.style.color = 'white';
          }} onMouseOut={e => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.color = '#4CAF50';
          }}>
            My Profile
          </button>
        </header>

        {/* main content */}
        <main style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '40px 20px',
          textAlign: 'center'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '15px',
            boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
            padding: '40px',
            maxWidth: '800px',
            width: '100%',
            margin: '20px 0'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              backgroundColor: '#e8f5e9',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <span style={{ fontSize: '40px', color: '#4CAF50' }}>👋</span>
            </div>

            <h2 style={{
              fontSize: '36px',
              color: '#2c3e50',
              margin: '10px 0'
            }}>Welcome to Healthy Bites <span style={{ color: '#4CAF50' }}>{username}</span>!</h2>

            <p style={{
              fontSize: '18px',
              color: '#7f8c8d',
              lineHeight: '1.6',
              maxWidth: '600px',
              margin: '20px auto'
            }}>
              We're thrilled to have you join our community of health-conscious food lovers.
              Your journey to healthier eating starts now!
            </p>

            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '20px',
              margin: '30px 0'
            }}>
              <button onClick={handleExploreMeals} style={{
                padding: '14px 32px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '30px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                boxShadow: '0 4px 6px rgba(76, 175, 80, 0.3)'
              }} onMouseOver={e => e.target.style.transform = 'translateY(-2px)'}
                onMouseOut={e => e.target.style.transform = 'translateY(0)'}>
                Explore Meal Plans
              </button>

              <button onClick={handleProfileSetup} style={{
                padding: '14px 32px',
                backgroundColor: 'white',
                color: '#4CAF50',
                border: '1px solid #4CAF50',
                borderRadius: '30px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }} onMouseOver={e => {
                e.target.style.backgroundColor = '#f1f8e9';
              }} onMouseOut={e => {
                e.target.style.backgroundColor = 'white';
              }}>
                Complete Your Profile
              </button>
            </div>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            margin: '40px 0',
            gap: '40px',
            flexWrap: 'wrap'
          }}>
            <div style={{
              flex: 1,
              minWidth: '300px',
              textAlign: 'left',
              padding: '30px'
            }}>
              <h3 style={{ color: '#2c3e50', fontSize: '24px' }}>Your Healthy Journey Starts Here</h3>
              <p style={{ color: '#7f8c8d', lineHeight: '1.7' }}>
                At Healthy Bites, we believe that eating well shouldn't be complicated.
                Our meal planner helps you create delicious, nutritious meals tailored to
                your dietary preferences and health goals.
              </p>

              <div style={{ marginTop: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', margin: '15px 0' }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    backgroundColor: '#e8f5e9',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '15px'
                  }}>
                    <span style={{ color: '#4CAF50', fontWeight: 'bold' }}>✓</span>
                  </div>
                  <span style={{ color: '#2c3e50' }}>Personalized meal recommendations</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', margin: '15px 0' }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    backgroundColor: '#e8f5e9',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '15px'
                  }}>
                    <span style={{ color: '#4CAF50', fontWeight: 'bold' }}>✓</span>
                  </div>
                  <span style={{ color: '#2c3e50' }}>Nutrition tracking and insights</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', margin: '15px 0' }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    backgroundColor: '#e8f5e9',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '15px'
                  }}>
                    <span style={{ color: '#4CAF50', fontWeight: 'bold' }}>✓</span>
                  </div>
                  <span style={{ color: '#2c3e50' }}>Easy-to-follow recipes</span>
                </div>
              </div>
            </div>

            <div style={{
              flex: 1,
              minWidth: '300px',
              borderRadius: '15px',
              overflow: 'hidden',
              boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
              height: '400px',
              backgroundImage: 'url(w.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }} />
          </div>

          <div style={{
            backgroundColor: '#e8f5e9',
            borderRadius: '15px',
            padding: '30px',
            margin: '40px 0',
            width: '100%',
            maxWidth: '800px'
          }}>
            <h3 style={{ color: '#2c3e50', textAlign: 'center' }}>Ready to get started?</h3>
            <p style={{ color: '#7f8c8d', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
              Complete your profile to get personalized meal recommendations based on your dietary preferences,
              health goals, and taste preferences.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
              <button onClick={handleProfileSetup} style={{
                padding: '12px 30px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '30px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <span>Set Up My Profile</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </main>

        <footer style={{
          textAlign: 'center',
          padding: '30px 0',
          color: '#7f8c8d',
          borderTop: '1px solid rgba(0,0,0,0.1)',
          marginTop: '30px'
        }}>
          <p>© 2023 Healthy Bites. All rights reserved.</p>
          <p style={{ fontSize: '14px', marginTop: '10px' }}>
            Your journey to healthier eating starts today. We're here to support you every step of the way.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default WelcomePage;