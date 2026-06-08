import React from 'react';

function Footer() {
  return <>
    <footer style={{
      backgroundColor: '#1a252f',
      color: '#7f8c8d',
      padding: '40px 20px',
      fontSize: '14px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '30px'
      }}>
        <div>
          <h4 style={{ color: 'white', margin: '0 0 15px' }}>Healthy Bites</h4>
          <p>Your personal meal planning assistant for healthier eating habits.</p>
        </div>

        <div>
          <h4 style={{ color: 'white', margin: '0 0 15px' }}>Resources</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: '8px' }}>Blog</li>
            <li style={{ marginBottom: '8px' }}>Recipes</li>
            <li style={{ marginBottom: '8px' }}>Meal Plans</li>
            <li style={{ marginBottom: '8px' }}>Nutrition Guide</li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: 'white', margin: '0 0 15px' }}>Company</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: '8px' }}>About Us</li>
            <li style={{ marginBottom: '8px' }}>Contact</li>
            <li style={{ marginBottom: '8px' }}>Careers</li>
            <li style={{ marginBottom: '8px' }}>Press</li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: 'white', margin: '0 0 15px' }}>Legal</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: '8px' }}>Privacy Policy</li>
            <li style={{ marginBottom: '8px' }}>Terms of Service</li>
            <li style={{ marginBottom: '8px' }}>Cookie Policy</li>
          </ul>
        </div>
      </div>

      <div style={{
        maxWidth: '1200px',
        margin: '40px auto 0',
        paddingTop: '20px',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        textAlign: 'center'
      }}>
        <p>© 2025 Healthy Bites. All rights reserved.</p>
      </div>
    </footer>
  </>
}

export default Footer;
