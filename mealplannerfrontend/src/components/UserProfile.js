import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UserHeader from './UserHeader';
import Apis from './Apis';

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        contact: '',
        preferences: {
            preferredDiet: '',
            allergies: [],
            weight: '',
            bodyFatLevel: '',
            goal: '',
            meals: []
        }
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/sign-in');
                    return;
                }

                const response = await axios.get(Apis.GET_PROFILE, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                const userData = response.data;
                setUser(userData);
                setFormData({
                    username: userData.username || '',
                    contact: userData.contact || '',
                    preferences: {
                        preferredDiet: userData.preferences?.preferredDiet || '',
                        allergies: userData.preferences?.allergies || [],
                        weight: userData.preferences?.weight || '',
                        bodyFatLevel: userData.preferences?.bodyFatLevel || '',
                        goal: userData.preferences?.goal || '',
                        meals: userData.preferences?.meals || []
                    }
                });
            } catch (err) {
                console.error("Profile fetch error:", err);
                setError('Failed to load your profile. Please try logging in again.');
                if (err.response?.status === 401) {
                    navigate('/sign-in');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePreferenceChange = (e) => {
        const { name, value, type, checked } = e.target;
        const currentPreferences = formData.preferences;

        let newValues;
        if (type === 'checkbox') {
            const currentArray = currentPreferences[name] || [];
            if (checked) {
                newValues = [...currentArray, value];
            } else {
                newValues = currentArray.filter(item => item !== value);
            }
        } else {
            newValues = value;
        }

        setFormData(prev => ({
            ...prev,
            preferences: { ...prev.preferences, [name]: newValues }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/sign-in');
                return;
            }

            const updatedData = {
                username: formData.username,
                contact: formData.contact,
                preferences: {
                    ...formData.preferences,
                    weight: Number(formData.preferences.weight) || 0
                }
            };

            await axios.post(Apis.UPDATE_PROFILE, updatedData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            setSuccessMessage('Profile updated successfully! Your next meal plan will use these new preferences.');
            setTimeout(() => setSuccessMessage(''), 3000);

        } catch (err) {
            console.error('Update error:', err);
            setError('Failed to update profile: ' + (err.response?.data?.message || err.message));
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
                <p>Loading your profile...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'red', fontFamily: 'Arial, sans-serif' }}>
                <p>{error}</p>
            </div>
        );
    }

    const dietOptions = ['Vegan', 'Vegetarian', 'Keto', 'Paleo', 'No Restrictions', 'Mediterranean'];
    const allergyOptions = ['Gluten', 'Peanut', 'Eggs', 'Fish', 'Soy', 'Shellfish', 'TreeNuts'];
    const bodyFatOptions = ['Low', 'Medium', 'High'];
    const goalOptions = [{ value: 'Weight Loss', label: 'Weight Loss' }, { value: 'Gain', label: 'Gain Muscle' }, { value: 'Maintain', label: 'Maintain Weight' }];
    const mealOptions = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

    return (
        <>
            <UserHeader />
            <div style={{ backgroundColor: '#f8f9fa', padding: '40px 20px', fontFamily: "'Segoe UI', sans-serif" }}>
                <form onSubmit={handleSubmit} style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: '30px' }}>

                    <h1 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '30px' }}>Your Profile</h1>

                    <div style={{ marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
                        <h2 style={{ color: '#4CAF50', fontSize: '18px', marginBottom: '20px' }}>Personal Information</h2>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Full Name</label>
                            <input type="text" name="username" value={formData.username} onChange={handleInputChange} placeholder="Enter your name" style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Email Address</label>
                            <input type="email" value={user.email} disabled style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', backgroundColor: '#e9ecef', cursor: 'not-allowed' }} />
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Contact Number</label>
                            <input type="tel" name="contact" value={formData.contact} onChange={handleInputChange} placeholder="Enter your contact number" style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
                        </div>
                    </div>

                    <div style={{ marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
                        <h2 style={{ color: '#4CAF50', fontSize: '18px', marginBottom: '20px' }}>Dietary Preferences</h2>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500' }}>Preferred Diet</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                                {dietOptions.map(option => (
                                    <label key={option} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                        <input type="radio" name="preferredDiet" value={option === 'No Restrictions' ? 'anything' : option.toLowerCase()} checked={formData.preferences.preferredDiet === (option === 'No Restrictions' ? 'anything' : option.toLowerCase())} onChange={handlePreferenceChange} style={{ marginRight: '5px' }} />
                                        {option}
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500' }}>Allergies</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                                {allergyOptions.map(option => (
                                    <label key={option} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                        <input type="checkbox" name="allergies" value={option.toLowerCase()} checked={formData.preferences.allergies.includes(option.toLowerCase())} onChange={handlePreferenceChange} style={{ marginRight: '5px' }} />
                                        {option}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div style={{ marginBottom: '30px' }}>
                        <h2 style={{ color: '#4CAF50', fontSize: '18px', marginBottom: '20px' }}>Health Goals</h2>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '15px' }}>
                            <div style={{ flex: '1 1 200px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Weight (kg)</label>
                                <input type="number" name="weight" value={formData.preferences.weight} onChange={handlePreferenceChange} placeholder="e.g., 70" style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
                            </div>
                            <div style={{ flex: '1 1 200px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Body Fat Level</label>
                                <select name="bodyFatLevel" value={formData.preferences.bodyFatLevel} onChange={handlePreferenceChange} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}>
                                    <option value="">Select Level</option>
                                    {bodyFatOptions.map(option => <option key={option} value={option}>{option}</option>)}
                                </select>
                            </div>
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500' }}>Primary Goal</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                                {goalOptions.map(option => (
                                    <label key={option.value} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                        <input type="radio" name="goal" value={option.value} checked={formData.preferences.goal === option.value} onChange={handlePreferenceChange} style={{ marginRight: '5px' }} />
                                        {option.label}
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500' }}>Meals to Plan</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                                {mealOptions.map(option => (
                                    <label key={option} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                        <input type="checkbox" name="meals" value={option.toLowerCase()} checked={formData.preferences.meals.includes(option.toLowerCase())} onChange={handlePreferenceChange} style={{ marginRight: '5px' }} />
                                        {option}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '30px' }}>
                        <button type="submit" style={{ padding: '12px 30px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '25px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
                            Save Changes
                        </button>
                    </div>

                    {successMessage && <p style={{ color: 'green', textAlign: 'center', marginTop: '15px' }}>{successMessage}</p>}
                    {error && <p style={{ color: 'red', textAlign: 'center', marginTop: '15px' }}>{error}</p>}
                </form>
            </div>
        </>
    );
};

export default UserProfile;