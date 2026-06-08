import React, { useState, useEffect } from 'react';

const AdminDashboard = () => {
  const [meals, setMeals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentMeal, setCurrentMeal] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    imageUrl: ''
  });

  const API_URL = 'https://healthy-backend.onrender.com/admin/meals';

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const fetchMeals = async () => {
    try {
      const response = await fetch(API_URL, {
        headers: getAuthHeaders()
      });

      if (!response.ok) throw new Error('Failed to fetch meals');

      const data = await response.json();
      setMeals(data);
    } catch (error) {
      console.error('Error fetching meals:', error);
      alert('Failed to load meals. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = currentMeal ? `${API_URL}/${currentMeal._id}` : API_URL;
      const method = currentMeal ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Operation failed');

      alert(`Meal ${currentMeal ? 'updated' : 'added'} successfully!`);

      resetForm();
      fetchMeals();
    } catch (error) {
      console.error('Error saving meal:', error);
      alert('Failed to save meal. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      imageUrl: ''
    });
    setCurrentMeal(null);
    setShowForm(false);
  };

  const handleEdit = (meal) => {
    setCurrentMeal(meal);
    setFormData({
      name: meal.name,
      description: meal.description,
      calories: meal.calories,
      protein: meal.nutrients?.protein || '',
      carbs: meal.nutrients?.carbs || '',
      fat: meal.nutrients?.fats || '',
      imageUrl: meal.imageUrl || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this meal?')) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!response.ok) throw new Error('Delete failed');

      alert('Meal deleted successfully!');
      fetchMeals();
    } catch (error) {
      console.error('Error deleting meal:', error);
      alert('Failed to delete meal. Please try again.');
    }
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Admin Dashboard</h1>

      {!showForm ? (
        <div>
          <button
            onClick={() => setShowForm(true)}
            style={styles.addButton}
          >
            + Add New Meal
          </button>

          <MealList
            meals={meals}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      ) : (
        <MealForm
          formData={formData}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          onCancel={resetForm}
          isEditing={!!currentMeal}
        />
      )}
    </div>
  );
};

const MealList = ({ meals, onEdit, onDelete }) => {
  if (meals.length === 0) {
    return <p style={styles.noMeals}>No meals found. Add your first meal!</p>;
  }

  return (
    <div style={styles.listContainer}>
      <h2 style={styles.subHeader}>Meal List</h2>
      <div style={styles.grid}>
        {meals.map(meal => (
          <div key={meal._id} style={styles.card}>
            <div style={styles.cardHeader}>
              <h3 style={styles.mealName}>{meal.name}</h3>
              <div>
                <button
                  onClick={() => onEdit(meal)}
                  style={styles.editButton}
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(meal._id)}
                  style={styles.deleteButton}
                >
                  Delete
                </button>
              </div>
            </div>
            <p style={styles.description}>{meal.description}</p>
            <div style={styles.nutrition}>
              <span>Calories: {meal.calorie}</span>
              <span>Protein: {meal.nutrients?.protein || 0}g</span>
              <span>Carbs: {meal.nutrients?.carbs || 0}g</span>
              <span>Fat: {meal.nutrients?.fats || 0}g</span>
            </div>
            {meal.imageUrl && (
              <img
                src={meal.imageUrl}
                alt={meal.name}
                style={styles.mealImage}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const MealForm = ({ formData, onChange, onSubmit, onCancel, isEditing }) => {
  return (
    <div style={styles.formContainer}>
      <h2 style={styles.subHeader}>{isEditing ? 'Edit Meal' : 'Add New Meal'}</h2>
      <form onSubmit={onSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={onChange}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Recipe</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={onChange}
            required
            style={{ ...styles.input, ...styles.textarea }}
          />
        </div>

        <div style={styles.nutritionGrid}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Calories</label>
            <input
              type="number"
              name="calories"
              value={formData.calories}
              onChange={onChange}
              required
              min="0"
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Protein(g)</label>
            <input
              type="number"
              name="protein"
              value={formData.protein}
              onChange={onChange}
              required
              min="0"
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Carbs(g)</label>
            <input
              type="number"
              name="carbs"
              value={formData.carbs}
              onChange={onChange}
              required
              min="0"
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Fat(g)</label>
            <input
              type="number"
              name="fat"
              value={formData.fat}
              onChange={onChange}
              required
              min="0"
              style={styles.input}
            />
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Image URL</label>
          <input
            type="text"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={onChange}
            placeholder="https://example.com/image.jpg"
            style={styles.input}
          />
        </div>

        <div style={styles.buttonGroup}>
          <button type="submit" style={styles.submitButton}>
            {isEditing ? 'Update Meal' : 'Add Meal'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            style={styles.cancelButton}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  header: {
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: '30px'
  },
  subHeader: {
    color: '#3498db',
    borderBottom: '2px solid #3498db',
    paddingBottom: '10px',
    marginTop: '0'
  },
  addButton: {
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    marginBottom: '20px',
    fontWeight: 'bold'
  },
  listContainer: {
    marginTop: '20px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
    marginTop: '20px'
  },
  card: {
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '15px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    backgroundColor: 'white'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px'
  },
  mealName: {
    margin: '0',
    color: '#2c3e50'
  },
  editButton: {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '5px'
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  description: {
    color: '#7f8c8d',
    fontSize: '14px',
    marginBottom: '10px'
  },
  nutrition: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    color: '#34495e',
    marginBottom: '10px'
  },
  mealImage: {
    width: '100%',
    height: '150px',
    objectFit: 'cover',
    borderRadius: '4px',
    marginTop: '10px'
  },
  noMeals: {
    textAlign: 'center',
    color: '#7f8c8d',
    padding: '20px'
  },
  formContainer: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    marginTop: '20px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column'
  },
  formGroup: {
    marginBottom: '15px'
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#2c3e50'
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
    boxSizing: 'border-box'
  },
  textarea: {
    height: '80px',
    resize: 'vertical'
  },
  nutritionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '15px'
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px'
  },
  submitButton: {
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold'
  },
  cancelButton: {
    backgroundColor: '#95a5a6',
    color: 'white',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px'
  }
};

export default AdminDashboard;
