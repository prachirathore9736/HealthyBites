import React from 'react';
import './ContactUs.css';
import contactImage from './images/contact.png';

function ContactUs() {
  return <>
    <div className="contact-container">
      <div className="contact-form">
        <h2>We’d Love to Hear From You!</h2>
        <p>Get in Touch</p>
        <form>
          <label >Name</label>
          <input type="text" id="name" placeholder="Enter your Name" />

          <label>Email</label>
          <input type="email" id="email" placeholder="Enter your Email Address" />

          <label>Message</label>
          <textarea id="message" placeholder="Your Message"></textarea>

          <button type="submit">Send Message</button>
        </form>
      </div>
      <div className="contact-info">
        <img src={contactImage} alt="Contact Illustration" className="contact-img" />
        <div className="reach-us">
          <h3>Reach Us Directly</h3>
          <ul>
            <li>
              <strong>Email:</strong>{' '}
              <a href="mailto:support@gmail.com">support@healthybites.com</a>
            </li>
            <li>
              <strong>Instagram:</strong>{' '}
              <a href="https://www.instagram.com/healthybites" target="_blank" rel="noopener noreferrer">
                @healthybites
              </a>
            </li>
            <li>
              <strong>Twitter:</strong>{' '}
              <a href="https://www.twitter.com/HealthyBitesApp" target="_blank" rel="noopener noreferrer">
                @HealthyBitesApp
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </>
}

export default ContactUs;
