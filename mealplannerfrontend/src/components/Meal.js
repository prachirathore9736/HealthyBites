import breakfastImg from './images/breakfast.jpg';
import lunchImg from './images/lunch.png';
import dinnerImg from './images/dinner.png';
import Header from './Header';
import './Meal.css';
import { useNavigate } from 'react-router-dom';


function Meal() {
  const navigate = useNavigate();
  return (
    <div className="explore-container">
      <Header />

      <div className="hero">
        <div className="hero-content">
          <h1>Transform Your Eating Habits</h1>
          <p>Discover personalized meal plans tailored to your unique taste, goals, and dietary needs</p>
        </div>
      </div>

      <div className="about-section">
        <h2>About Healthy Bites</h2>
        <div className="about-content">
          <div className="about-card">
            <div className="icon-circle">
              <span>🍎</span>
            </div>
            <h3>Personalized Nutrition</h3>
            <p>Custom meal plans based on your dietary preferences, allergies, and health goals</p>
          </div>

          <div className="about-card">
            <div className="icon-circle">
              <span>⏱️</span>
            </div>
            <h3>Save Time</h3>
            <p>No more meal planning stress - we create your weekly menu with shopping lists</p>
          </div>

          <div className="about-card">
            <div className="icon-circle">
              <span>📱</span>
            </div>
            <h3>Access Anywhere</h3>
            <p>Your meal plan available on all devices - desktop, tablet, and mobile</p>
          </div>
        </div>
      </div>

      <div className="meal-section">
        <h1 className="meal-title">Sample Meal Plan</h1>
        <p className="meal-subtitle">Here's what a typical day might look like</p>

        <div className="meal-cards">
          <div className="meal-card">
            <div className="meal-image" style={{ backgroundImage: `url(${breakfastImg})` }}></div>
            <div className="meal-content">
              <h2>Breakfast</h2>
              <p className="meal-name">Oatmeal with Fruit</p>
              <p className="meal-info">350kcal &nbsp;|&nbsp; 55g carbs</p>
              <p className="meal-description">Steel-cut oats with fresh berries, banana slices, and a drizzle of honey</p>
            </div>
          </div>

          <div className="meal-card">
            <div className="meal-image" style={{ backgroundImage: `url(${lunchImg})` }}></div>
            <div className="meal-content">
              <h2>Lunch</h2>
              <p className="meal-name">Grilled Chicken Salad</p>
              <p className="meal-info">400kcal &nbsp;|&nbsp; 20g carbs</p>
              <p className="meal-description">Fresh greens with grilled chicken, cherry tomatoes, cucumber, and light vinaigrette</p>
            </div>
          </div>

          <div className="meal-card">
            <div className="meal-image" style={{ backgroundImage: `url(${dinnerImg})` }}></div>
            <div className="meal-content">
              <h2>Dinner</h2>
              <p className="meal-name">Stir-Fried Vegetables</p>
              <p className="meal-info">500kcal &nbsp;|&nbsp; 10g carbs</p>
              <p className="meal-description">Colorful veggies stir-fried in sesame oil with tofu and ginger sauce</p>
            </div>
          </div>
        </div>
        <button className="next-btn" onClick={() => navigate('/lockedpage')}>
          Get Your Personalized Plan
        </button>

      </div>

      <div className="testimonials">
        <h2>What Our Users Say</h2>
        <div className="testimonial-cards">
          <div className="testimonial-card">
            <div className="testimonial-content">
              <p>"Healthy Bites transformed my relationship with food. I've lost 15 pounds in 2 months without feeling deprived!"</p>
              <div className="testimonial-author">
                <span className="author-name">Shivani</span>
                <span className="author-location">India</span>
              </div>
            </div>
          </div>

          <div className="testimonial-card">
            <div className="testimonial-content">
              <p>"As a busy professional, I never had time to meal plan. Now I have delicious, healthy meals ready every week!"</p>
              <div className="testimonial-author">
                <span className="author-name">Shubh</span>
                <span className="author-location">India</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Meal;