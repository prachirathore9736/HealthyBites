import React from 'react';
import './About.css';
import chefImage from './images/about.png';

function About() {
  return <>
    <section className="about">
      <div className="about-left">
        <img src={chefImage} alt="Chef holding meal plan" className="chef-img" />
      </div>
      <div className="about-right">
        <h1 className="title">Fueling Your Goals, One Meal at a Time</h1>
        <p className="description">
          Healthy Bites makes eating well simple. Whether you're tracking macros, managing food allergies, or just trying to stay healthy —
          our AI-powered meal planner generates personalized meal plans that fit your lifestyle.
        </p>
        <div className="highlights">
          <h2>What Makes Us Different?</h2>
          <ul>
            <li><span>⚡</span> AI-generated personalized meal plans</li>
            <li><span>🥗</span> Compatible with keto, vegan, paleo, and more</li>
            <li><span>🔒</span> Allergy-safe ingredient filtering</li>
            <li><span>📈</span> Nutritional tracking with smart suggestions</li>
          </ul>
        </div>
      </div>
    </section>
  </>
};

export default About;
