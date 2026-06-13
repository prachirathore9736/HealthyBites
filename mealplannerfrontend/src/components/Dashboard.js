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
        padding: '30px 20px',
        backgroundColor: '#f8f9fa',
        minHeight: '100vh',
        gap: '30px',
        flexWrap: 'wrap'
      }}>
        {/* Left/Main Column */}
        <div style={{ flex: '2 1 600px', maxWidth: '800px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#1a202c', margin: '0 0 25px' }}>
            Today • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </h1>

          {/* Calorie Stats Panel */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            backgroundColor: '#fff', borderRadius: '16px', padding: '20px',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)', marginBottom: '30px'
          }}>
            <div>
              <p style={{ margin: '0 0 4px', fontSize: '14px', color: '#718096', fontWeight: 500 }}>Today's Nutrition</p>
              <p style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#2d3748' }}>
                {nutrition.calories} <span style={{ fontSize: '16px', fontWeight: 500, color: '#718096' }}>Calories</span>
              </p>
            </div>
            <div style={{ display: 'flex', gap: '15px' }}>
              <MacroCircle percent={macros.proteinPercent} color="#48bb78" label="Protein" />
              <MacroCircle percent={macros.carbsPercent} color="#ed8936" label="Carbs" />
              <MacroCircle percent={macros.fatPercent} color="#f56565" label="Fat" />
            </div>
          </div>

          {/* Refactored Big-Image Card Grid Layout */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '25px',
            marginBottom: '40px'
          }}>
            {mealPlan && Object.keys(mealPlan).map(mealType => (
              <div key={mealType} style={{
                backgroundColor: '#fff', 
                borderRadius: '16px', 
                overflow: 'hidden',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  {/* Big Image Banner Section */}
                  <div style={{ position: 'relative', height: '180px', width: '100%' }}>
                    <img 
                      src={mealPlan?.[mealType]?.imageUrl}
                      alt={mealType} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                    <div style={{
                      position: 'absolute', top: '12px', left: '12px',
                      backgroundColor: 'rgba(255,255,255,0.9)', padding: '4px 12px',
                      borderRadius: '20px', fontSize: '12px', fontWeight: 700, color: '#2d3748',
                      textTransform: 'uppercase', letterSpacing: '0.5px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                    }}>
                      {mealType}
                    </div>
                  </div>

                  {/* Text Description Box */}
                  <div style={{ padding: '20px 20px 10px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#2d3748', margin: '0 0 4px' }}>
                      {mealPlan?.[mealType]?.name}
                    </h3>
                    <p style={{ margin: 0, fontSize: '14px', color: '#718096' }}>1 serving • {mealPlan?.[mealType]?.calories || 0} Cals</p>
                  </div>
                </div>

                <div style={{ padding: '0 20px 20px' }}>
                  <button style={{
                    width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0',
                    backgroundColor: '#fff', color: '#3182ce', fontWeight: 600, fontSize: '14px', 
                    cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center'
                  }} 
                  onClick={() => { setSelectedMeal(mealPlan[mealType]); setShowRecipe(true); }}
                  onMouseOver={e => { e.target.style.backgroundColor = '#ebf8ff'; e.target.style.borderColor = '#bee3f8'; }}
                  onMouseOut={e => { e.target.style.backgroundColor = '#fff'; e.target.style.borderColor = '#e2e8f0'; }}
                  >
                    View Recipe
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Action Button Container */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
            <button
              style={{
                backgroundColor: '#48bb78', color: 'white', border: 'none',
                borderRadius: '10px', padding: '14px 32px', fontWeight: 600,
                fontSize: '16px', cursor: 'pointer', boxShadow: '0 4px 6px rgba(56,161,105,0.2)',
                transition: 'background-color 0.2s'
              }}
              onClick={fetchMealPlan}
              onMouseOver={e => e.target.style.backgroundColor = '#38a169'}
              onMouseOut={e => e.target.style.backgroundColor = '#48bb78'}
            >
              Generate New Plan
            </button>
          </div>
        </div>

        {/* Right Sidebar - Balanced Container height */}
        <div style={{
          flex: '1 1 300px', 
          maxWidth: '350px', 
          backgroundColor: '#fff',
          borderRadius: '16px', 
          padding: '24px', 
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
          alignSelf: 'flex-start' // Stops the container from stretching infinitely downwards
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#2d3748', marginBottom: '20px' }}>
            Nutrition Summary
          </h2>

          {[
            { label: 'Protein', value: nutrition.protein, color: '#48bb78' },
            { label: 'Carbs', value: nutrition.carbs, color: '#ed8936' },
            { label: 'Fat', value: nutrition.fat, color: '#f56565' }
          ].map((m, i) => (
            <div key={i} style={{ marginBottom: '20px' }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                fontSize: '14px', fontWeight: '600', color: '#4a5568', marginBottom: '8px'
              }}>
                <span>{m.label}</span>
                <span style={{ color: '#2d3748', fontWeight: 700 }}>{m.value}g</span>
              </div>
              <div style={{
                height: '8px', width: '100%', backgroundColor: '#edf2f7',
                borderRadius: '4px', overflow: 'hidden'
              }}>
                <div style={{
                  width: `${Math.min(100, m.value)}%`, height: '100%', backgroundColor: m.color,
                  borderRadius: '4px'
                }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recipe Modal */}
      {showRecipe && selectedMeal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex',
          justifyContent: 'center', alignItems: 'center', zIndex: 1000,
          backdropFilter: 'blur(4px)'
        }}>
          <div style={{
            backgroundColor: '#fff', borderRadius: '16px', padding: '30px',
            width: '90%', maxWidth: '500px', maxHeight: '80vh',
            overflowY: 'auto', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)'
          }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'
            }}>
              <h3 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: '#2d3748' }}>
                {selectedMeal.name}
              </h3>
              <button onClick={() => setShowRecipe(false)}
                style={{ background: 'none', border: 'none', fontSize: '28px', cursor: 'pointer', color: '#a0aec0', lineHeight: 1 }}>
                ×
              </button>
            </div>
            <div>
              <p style={{ fontWeight: 700, marginBottom: '10px', fontSize: '16px', color: '#2d3748' }}>Ingredients:</p>
              <ul style={{ paddingLeft: '20px', marginBottom: '25px' }}>
                {selectedMeal.ingredients?.map((ing, idx) => (
                  <li key={idx} style={{ marginBottom: '8px', fontSize: '14px', color: '#4a5568' }}>
                    {ing.name} – <span style={{ fontWeight: 600 }}>{ing.quantity}</span>
                  </li>
                ))}
              </ul>
              <p style={{ fontWeight: 700, marginBottom: '10px', fontSize: '16px', color: '#2d3748' }}>Recipe Instructions:</p>
              <p style={{ fontSize: '14px', lineHeight: '1.7', whiteSpace: 'pre-wrap', color: '#4a5568' }}>
                {selectedMeal.recipe || 'No recipe available.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>

    {/* Footer */}
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