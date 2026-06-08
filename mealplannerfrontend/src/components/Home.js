import React, { useState } from 'react';
import Header from './Header';
import About from './About';
import ContactUs from './ContactUs';
import { Link } from 'react-router-dom';
import fruitClock from './images/fruit-clock.jpg';
import Footer from './Footer';

function Home() {
  const [hover, setHover] = useState(false);

  return (
    <>
      <Header />
      <section
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '80px 10px',
          backgroundColor: '#fff',
        }}
      >
        <div
          style={{
            flex: 1,
            minWidth: '300px',
            paddingLeft: '100px',
            paddingRight: '20px',
          }}
        >
          <h1 style={{ fontSize: '40px', fontWeight: 'bold' }}>
            Smarter Meal <br />
            <span style={{ color: '#7ed957' }}>Planning.</span>
          </h1>

          <p
            style={{
              fontSize: '20px',
              marginTop: '20px',
              marginBottom: '30px',
              color: '#333',
              lineHeight: '30px',
            }}
          >
            Healthy Bites creates personalized meal plans based on your goals,
            preferences, and schedule. Build your perfect diet in minutes! Get
            personalized meals you’ll love — whether it’s for fitness or
            healthy living. Fast. Simple. Delicious.
          </p>

          <Link
            to="/sign-up"
            style={{
              padding: '12px 24px',
              backgroundColor: hover ? '#aef093' : '#c5f5b3',
              color: 'black',
              fontWeight: 'bold',
              borderRadius: '25px',
              textDecoration: 'none',
              display: 'inline-block',
              transition: 'background-color 0.3s',
            }}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            Create your Account
          </Link>
        </div>

        <div
          style={{
            flex: 1,
            minWidth: '250px',
            textAlign: 'center',
            padding: '20px',
          }}
        >
          <img
            src={fruitClock}
            alt="Fruit Clock"
            style={{ maxWidth: '85%', height: 'auto' }}
          />
        </div>
      </section>

      <About />
      <ContactUs />
      <Footer />
    </>
  );
}

export default Home;