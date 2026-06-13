import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserHeader from './UserHeader';
import Apis from './Apis';

const Dashboard = () => {
  const [mealPlan, setMealPlan] = useState(null);
  const [nutrition, setNutrition] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0 });
  const [macros, setMacros] = useState({ proteinPercent: 0, carbsPercent: 0, fatPercent: 0 });
  const [showRecipe, setShowRecipe] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);

  const fetchMealPlan = async () => {
    try {
      const res = await axios.get(Apis.GENERATE_MEAL_PLAN, { withCredentials: true });
      const plan = res.data.plan;
      setMealPlan(plan);

      let totalCals = 0, totalProt = 0, totalCarb = 0, totalFat = 0;
      Object.values(plan).forEach(meal => {
        totalCals += meal.calories || 0;
        totalProt += meal.protein || 0;
        totalCarb += meal.carbs || 0;
        totalFat += meal.fats || 0;
      });

      setNutrition({ calories: totalCals, protein: totalProt, carbs: totalCarb, fat: totalFat });

      const protCal = totalProt * 4;
      const carbCal = totalCarb * 4;
      const fatCal = totalFat * 9;
      const totalMacroCal = protCal + carbCal + fatCal || 1;

      setMacros({
        proteinPercent: Math.round((protCal / totalMacroCal) * 100),
        carbsPercent: Math.round((carbCal / totalMacroCal) * 100),
        fatPercent: Math.round((fatCal / totalMacroCal) * 100)
      });
    } catch (err) {
      console.error("Fetch Meal Plan Error:", err);
    }
  };

  useEffect(() => { fetchMealPlan(); }, []);

  const MacroCircle = ({ percent, color, label }) => {
    const size = 60, stroke = 6;
    const r = (size - stroke) / 2;
    const circ = 2 * Math.PI * r;
    const offset = ((100 - percent) / 100) * circ;

    return (
      <div style={{ textAlign: 'center' }}>
        <svg width={size} height={size}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e6e6e6" strokeWidth={stroke} />
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
            strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`} />
          <text x="50%" y="50%" textAnchor="middle" dy=".3em" fontSize="14" fontWeight="600">{percent}%</text>
        </svg>
        <p style={{ margin: '8px 0 0', fontSize: '14px', color: '#718096' }}>{label}</p>
      </div>
    );
  };

  return <>
    <div>
      <UserHeader />
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        minHeight: '100vh',
        gap: '40px',
        flexWrap: 'wrap'
      }}>
        <div style={{ flex: '2 1 320px', maxWidth: '600px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 600, color: '#2d3748', margin: '0 0 25px' }}>
            Today • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </h1>

          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            backgroundColor: '#fff', borderRadius: '12px', padding: '15px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '20px'
          }}>
            <div>
              <p style={{ margin: '0 0 5px', fontSize: '14px', color: '#718096' }}>Today's Nutrition</p>
              <p style={{ margin: 0, fontSize: '20px', fontWeight: 600, color: '#2d3748' }}>
                {nutrition.calories} Calories
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <MacroCircle percent={macros.proteinPercent} color="#48bb78" label="Protein" />
              <MacroCircle percent={macros.carbsPercent} color="#ed8936" label="Carbs" />
              <MacroCircle percent={macros.fatPercent} color="#f56565" label="Fat" />
            </div>
          </div>

          {mealPlan && Object.keys(mealPlan).map(mealType => (
            <div key={mealType} style={{ marginBottom: '30px' }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#2d3748', margin: 0 }}>
                  {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                </h3>
                <p style={{ fontSize: '16px', fontWeight: 600, color: '#2d3748', margin: 0 }}>
                  {mealPlan?.[mealType]?.calories || 0} Calories
                </p>
              </div>

              <div style={{
                display: 'flex', alignItems: 'center', backgroundColor: '#fff', borderRadius: '12px',
                padding: '15px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <img src={mealPlan?.[mealType]?.imageUrl}
                  alt={mealType} style={{ width: '60px', height: '60px', borderRadius: '10px', marginRight: '15px', objectFit: 'cover' }} />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0 0 5px', fontWeight: 600, fontSize: '16px', color: '#2d3748' }}>
                    {mealPlan?.[mealType]?.name}
                  </p>
                  <p style={{ margin: '0 0 8px', fontSize: '14px', color: '#718096' }}>1 serving</p>
                  <button style={{
                    padding: 0, border: 'none', background: 'none',
                    color: '#4299e1', fontWeight: 600, fontSize: '14px', cursor: 'pointer'
                  }} onClick={() => { setSelectedMeal(mealPlan[mealType]); setShowRecipe(true); }}>
                    View Recipe
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* generate new plan */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
            <button
              style={{
                backgroundColor: '#48bb78', color: 'white', border: 'none',
                borderRadius: '8px', padding: '12px 24px', fontWeight: 600,
                fontSize: '16px', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
              onClick={fetchMealPlan}
              onMouseOver={e => e.target.style.backgroundColor = '#38a169'}
              onMouseOut={e => e.target.style.backgroundColor = '#48bb78'}
            >
              Generate New Plan
            </button>
          </div>
        </div>

        <div style={{
          flex: '1 1 300px', maxWidth: '350px', backgroundColor: '#fff',
          borderRadius: '12px', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#2d3748', marginBottom: '15px' }}>
            Nutrition Summary
          </h2>

          {[
            { label: 'Protein', value: nutrition.protein, color: '#48bb78' },
            { label: 'Carbs', value: nutrition.carbs, color: '#ed8936' },
            { label: 'Fat', value: nutrition.fat, color: '#f56565' }
          ].map((m, i) => (
            <div key={i} style={{ marginBottom: '15px' }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                fontSize: '14px', fontWeight: '600', color: '#2d3748', marginBottom: '5px'
              }}>
                <span>{m.label}</span><span>{m.value}g</span>
              </div>
              <div style={{
                height: '8px', width: '100%', backgroundColor: '#edf2f7',
                borderRadius: '4px', overflow: 'hidden'
              }}>
                <div style={{
                  width: `${Math.min(100, m.value)}%`, height: '100%', backgroundColor: m.color
                }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showRecipe && selectedMeal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
          justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#fff', borderRadius: '12px', padding: '25px',
            width: '90%', maxWidth: '500px', maxHeight: '80vh',
            overflowY: 'auto', boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
          }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'
            }}>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 600, color: '#2d3748' }}>
                {selectedMeal.name} Recipe
              </h3>
              <button onClick={() => setShowRecipe(false)}
                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#718096' }}>
                ×
              </button>
            </div>
            <div>
              <p style={{ fontWeight: 600, marginBottom: '10px', fontSize: '16px', color: '#2d3748' }}>Ingredients:</p>
              <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
                {selectedMeal.ingredients?.map((ing, idx) => (
                  <li key={idx} style={{ marginBottom: '8px', fontSize: '14px' }}>
                    {ing.name} – {ing.quantity}
                  </li>
                ))}
              </ul>
              <p style={{ fontWeight: 600, marginBottom: '10px', fontSize: '16px', color: '#2d3748' }}>Recipe Instructions:</p>
              <p style={{ fontSize: '14px', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                {selectedMeal.recipe || 'No recipe available.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
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
};

export default Dashboard;
