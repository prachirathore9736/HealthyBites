import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import WelcomeHeader from './WelcomeHeader';
import Apis from './Apis';

const ProfileSetup = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = location.state || {};

  const [formData, setFormData] = useState({
    preferredDiet: '',
    allergies: [],
    weight: '',
    bodyFatLevel: '',
    goal: '',
    meals: []
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (!token && !localStorage.getItem('token')) {
      navigate('/sign-in');
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const newErrors = {};
      if (!formData.preferredDiet) newErrors.preferredDiet = 'Diet is required';
      if (!formData.weight || isNaN(formData.weight)) newErrors.weight = 'Valid weight is required';
      if (!formData.bodyFatLevel) newErrors.bodyFatLevel = 'Body fat level is required';
      if (!formData.goal) newErrors.goal = 'Goal is required';
      if (formData.meals.length === 0) newErrors.meals = 'Select at least one meal';

      setErrors(newErrors);
      if (Object.keys(newErrors).length > 0) {
        setIsSubmitting(false);
        return;
      }

      // get the token to use (from location state or localStorage)
      const authToken = token || localStorage.getItem('token');

      const response = await axios.post(
        Apis.SET_PREFERENCES,
        {
          ...formData,
          weight: Number(formData.weight)
        },
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );

      if (response.data.success) {
        // store the new token if provided
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
        navigate('/dashboard');
      } else {
        throw new Error(response.data.message || 'Failed to save preferences');
      }
    } catch (error) {
      console.error('Profile setup error:', error);

      let errorMessage = 'Failed to save preferences';
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        errorMessage = 'Network error - please check your connection';
      } else {
        errorMessage = error.message;
      }

      setSubmitError(errorMessage);

      // if unauthorized, redirect to login
      if (error.response?.status === 401) {
        navigate('/sign-in');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  const validateForm = () => {
    const newErrors = {};

    if (!formData.preferredDiet) {
      newErrors.preferredDiet = 'Please select a diet preference';
    }

    if (!formData.weight || isNaN(formData.weight) || formData.weight <= 0 || formData.weight > 200) {
      newErrors.weight = 'Please enter a valid weight (1-200 kg)';
    }

    if (!formData.bodyFatLevel) {
      newErrors.bodyFatLevel = 'Please select your body fat level';
    }

    if (!formData.goal) {
      newErrors.goal = 'Please select your health goal';
    }

    if (formData.meals.length === 0) {
      newErrors.meals = 'Please select at least one meal';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const dietOptions = [
    { value: 'vegan', label: 'Vegan' },
    { value: 'vegetarian', label: 'Vegetarian' },
    { value: 'keto', label: 'Keto' },
    { value: 'paleo', label: 'Paleo' },
    { value: 'anything', label: 'No Restrictions' },
    { value: 'mediterranean', label: 'Mediterranean' }
  ];

  const allergyOptions = [
    { value: 'gluten', label: 'Gluten' },
    { value: 'peanut', label: 'Peanuts' },
    { value: 'eggs', label: 'Eggs' },
    { value: 'fish', label: 'Fish' },
    { value: 'soy', label: 'Soy' },
    { value: 'shellfish', label: 'Shellfish' },
    { value: 'treenuts', label: 'Tree Nuts' }
  ];

  const bodyFatOptions = [
    { value: 'Low', label: 'Low' },
    { value: 'Medium', label: 'Medium' },
    { value: 'High', label: 'High' }
  ];

  const goalOptions = [
    { value: 'Weight Loss', label: 'Weight Loss' },
    { value: 'Gain', label: 'Gain Muscle' },
    { value: 'Maintain', label: 'Maintain Weight' }
  ];

  const mealOptions = [
    { value: 'breakfast', label: 'Breakfast' },
    { value: 'lunch', label: 'Lunch' },
    { value: 'dinner', label: 'Dinner' },
    { value: 'snack', label: 'Snacks' }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      const currentValues = formData[name];
      let newValues;

      if (checked) {
        newValues = [...currentValues, value];
      } else {
        newValues = currentValues.filter(item => item !== value);
      }

      setFormData({ ...formData, [name]: newValues });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  {
    submitError && (
      <div style={{
        backgroundColor: '#ffebee',
        color: '#c62828',
        padding: '15px',
        borderRadius: '4px',
        marginBottom: '20px',
        borderLeft: '4px solid #c62828'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '5px'
        }}>
          <span style={{ fontSize: '20px' }}>⚠️</span>
          <strong>Error:</strong>
        </div>
        <p style={{ margin: '5px 0 0 30px' }}>{submitError}</p>
      </div>
    )
  }

  return <>
    <WelcomeHeader />
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      padding: '20px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        padding: '30px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '25px'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            backgroundColor: '#e8f5e9',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '15px'
          }}>
            <span style={{ fontSize: '30px', color: '#4CAF50' }}>🧑‍🍳</span>
          </div>
          <div>
            <h1 style={{
              margin: 0,
              color: '#2c3e50',
              fontSize: '28px',
              fontWeight: '700'
            }}>Set Up Your Profile</h1>
            <p style={{
              margin: '5px 0 0',
              color: '#7f8c8d',
              fontSize: '16px'
            }}>Help us create your personalized meal plan</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
          {/*diet preference*/}
          <div style={{ marginBottom: '25px' }}>
            <h3 style={{
              color: '#2c3e50',
              marginBottom: '15px',
              fontSize: '18px',
              fontWeight: '600'
            }}>Dietary Preference</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
              gap: '15px'
            }}>
              {dietOptions.map(option => (
                <div key={option.value} style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="radio"
                    id={`diet-${option.value}`}
                    name="preferredDiet"
                    value={option.value}
                    checked={formData.preferredDiet === option.value}
                    onChange={handleChange}
                    style={{ marginRight: '8px' }}
                  />
                  <label htmlFor={`diet-${option.value}`} style={{ cursor: 'pointer' }}>
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
            {errors.preferredDiet && (
              <p style={{ color: '#e74c3c', marginTop: '5px', fontSize: '14px' }}>
                {errors.preferredDiet}
              </p>
            )}
          </div>

          {/*allergies*/}
          <div style={{ marginBottom: '25px' }}>
            <h3 style={{
              color: '#2c3e50',
              marginBottom: '15px',
              fontSize: '18px',
              fontWeight: '600'
            }}>Allergies or Intolerances</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
              gap: '15px'
            }}>
              {allergyOptions.map(option => (
                <div key={option.value} style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    id={`allergy-${option.value}`}
                    name="allergies"
                    value={option.value}
                    checked={formData.allergies.includes(option.value)}
                    onChange={handleChange}
                    style={{ marginRight: '8px' }}
                  />
                  <label htmlFor={`allergy-${option.value}`} style={{ cursor: 'pointer' }}>
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/*weight*/}
          <div style={{ marginBottom: '25px' }}>
            <h3 style={{
              color: '#2c3e50',
              marginBottom: '15px',
              fontSize: '18px',
              fontWeight: '600'
            }}>Weight (kg)</h3>
            <div style={{ maxWidth: '200px' }}>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                min="1"
                max="200"
                style={{
                  width: '100%',
                  padding: '10px 15px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '16px'
                }}
                placeholder="Enter your weight"
              />
              {errors.weight && (
                <p style={{ color: '#e74c3c', marginTop: '5px', fontSize: '14px' }}>
                  {errors.weight}
                </p>
              )}
            </div>
          </div>

          {/*body fat level*/}
          <div style={{ marginBottom: '25px' }}>
            <h3 style={{
              color: '#2c3e50',
              marginBottom: '15px',
              fontSize: '18px',
              fontWeight: '600'
            }}>Body Fat Level</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
              gap: '15px'
            }}>
              {bodyFatOptions.map(option => (
                <div key={option.value} style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="radio"
                    id={`fat-${option.value}`}
                    name="bodyFatLevel"
                    value={option.value}
                    checked={formData.bodyFatLevel === option.value}
                    onChange={handleChange}
                    style={{ marginRight: '8px' }}
                  />
                  <label htmlFor={`fat-${option.value}`} style={{ cursor: 'pointer' }}>
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
            {errors.bodyFatLevel && (
              <p style={{ color: '#e74c3c', marginTop: '5px', fontSize: '14px' }}>
                {errors.bodyFatLevel}
              </p>
            )}
          </div>

          {/*health goal*/}
          <div style={{ marginBottom: '25px' }}>
            <h3 style={{
              color: '#2c3e50',
              marginBottom: '15px',
              fontSize: '18px',
              fontWeight: '600'
            }}>Health Goal</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: '15px'
            }}>
              {goalOptions.map(option => (
                <div key={option.value} style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="radio"
                    id={`goal-${option.value}`}
                    name="goal"
                    value={option.value}
                    checked={formData.goal === option.value}
                    onChange={handleChange}
                    style={{ marginRight: '8px' }}
                  />
                  <label htmlFor={`goal-${option.value}`} style={{ cursor: 'pointer' }}>
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
            {errors.goal && (
              <p style={{ color: '#e74c3c', marginTop: '5px', fontSize: '14px' }}>
                {errors.goal}
              </p>
            )}
          </div>

          {/*meal preferences*/}
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{
              color: '#2c3e50',
              marginBottom: '15px',
              fontSize: '18px',
              fontWeight: '600'
            }}>Which meals do you want to plan?</h3>
            <p style={{ color: '#7f8c8d', marginBottom: '15px' }}>
              Select at least one and up to four meals you'd like to include in your plan
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
              gap: '15px'
            }}>
              {mealOptions.map(option => (
                <div key={option.value} style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    id={`meal-${option.value}`}
                    name="meals"
                    value={option.value}
                    checked={formData.meals.includes(option.value)}
                    onChange={handleChange}
                    disabled={formData.meals.length >= 4 && !formData.meals.includes(option.value)}
                    style={{ marginRight: '8px' }}
                  />
                  <label
                    htmlFor={`meal-${option.value}`}
                    style={{
                      cursor: 'pointer',
                      opacity: formData.meals.length >= 4 && !formData.meals.includes(option.value) ? 0.5 : 1
                    }}
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
            {errors.meals && (
              <p style={{ color: '#e74c3c', marginTop: '5px', fontSize: '14px' }}>
                {errors.meals}
              </p>
            )}
          </div>

          {/*submit*/}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '14px 40px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '30px',
                fontSize: '18px',
                fontWeight: '600',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.7 : 1,
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
              onMouseOver={e => !isSubmitting && (e.target.style.transform = 'translateY(-2px)')}
              onMouseOut={e => !isSubmitting && (e.target.style.transform = 'translateY(0)')}
            >
              {isSubmitting ? (
                <>
                  <span>Saving...</span>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderRadius: '50%',
                    borderTopColor: 'white',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                </>
              ) : (
                'Save Preferences'
              )}
            </button>
          </div>

          {errors.submit && (
            <p style={{
              color: '#e74c3c',
              textAlign: 'center',
              marginTop: '15px',
              fontSize: '16px'
            }}>
              {errors.submit}
            </p>
          )}
        </form>
      </div>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  </>
};

export default ProfileSetup;