import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '80vh',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '6rem', fontWeight: '700', color: '#ff6b6b' }}>404</h1>
      <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>Page Not Found</h2>
      <p style={{ fontSize: '1.2rem', maxWidth: '600px', marginBottom: '30px' }}>
        Oops! The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        style={{
          padding: '12px 30px',
          backgroundColor: '#4CAF50',
          color: 'white',
          borderRadius: '30px',
          textDecoration: 'none',
          fontWeight: '600',
          fontSize: '1.1rem'
        }}
      >
        Go to Homepage
      </Link>
    </div>
  );
};

export default NotFound;