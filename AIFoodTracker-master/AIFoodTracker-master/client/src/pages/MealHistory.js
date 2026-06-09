import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiCalendar, FiFilter, FiTrash2, FiEdit, FiClock, FiImage as FiImageIcon } from 'react-icons/fi';

const MealHistory = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    mealType: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchMeals();
  }, [filters]);

  const fetchMeals = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.mealType) params.append('mealType', filters.mealType);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const response = await axios.get(`/api/meals?${params}`);
      setMeals(response.data.meals);
    } catch (error) {
      console.error('Error fetching meals:', error);
      toast.error('Failed to load meal history');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const deleteMeal = async (mealId) => {
    if (!window.confirm('Are you sure you want to delete this meal?')) return;

    try {
      await axios.delete(`/api/meals/${mealId}`);
      setMeals(meals.filter(meal => meal._id !== mealId));
      toast.success('Meal deleted successfully');
    } catch (error) {
      console.error('Error deleting meal:', error);
      toast.error('Failed to delete meal');
    }
  };

  const getMealTypeIcon = (mealType) => {
    switch (mealType) {
      case 'breakfast': return '🍳';
      case 'lunch': return '🥗';
      case 'dinner': return '🍽️';
      case 'snack': return '🥨';
      default: return '🍽️';
    }
  };

  const getMealTypeColor = (mealType) => {
    switch (mealType) {
      case 'breakfast': return 'bg-accent-100 text-accent-800';
      case 'lunch': return 'bg-primary-100 text-primary-800';
      case 'dinner': return 'bg-secondary-100 text-secondary-800';
      case 'snack': return 'bg-accent-100 text-accent-800';
      default: return 'bg-secondary-100 text-secondary-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-secondary-100 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center">
                <FiCalendar className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <div className="h-8 bg-secondary-300 rounded-2xl w-48 mb-2 animate-pulse"></div>
                <div className="h-4 bg-secondary-200 rounded-2xl w-64 animate-pulse"></div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="card p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="h-6 bg-secondary-200 rounded-2xl w-1/3 mb-4 animate-pulse"></div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {[...Array(5)].map((_, j) => (
                        <div key={j} className="h-4 bg-secondary-200 rounded-2xl animate-pulse"></div>
                      ))}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <div className="h-8 w-8 bg-secondary-200 rounded-2xl animate-pulse"></div>
                    <div className="h-8 w-8 bg-secondary-200 rounded-2xl animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-secondary-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center">
              <FiCalendar className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-4xl font-heading font-bold text-secondary-800">Meal History</h1>
              <p className="text-lg font-body text-secondary-600 mt-2">
                View and manage your meal records
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <FiFilter className="h-5 w-5 text-primary-500" />
              <h2 className="card-title">Filters</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="form-label">Meal Type</label>
              <select
                name="mealType"
                value={filters.mealType}
                onChange={handleFilterChange}
                className="form-input"
              >
                <option value="">All Types</option>
                <option value="breakfast">🍳 Breakfast</option>
                <option value="lunch">🥗 Lunch</option>
                <option value="dinner">🍽️ Dinner</option>
                <option value="snack">🥨 Snack</option>
              </select>
            </div>
            <div>
              <label className="form-label">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">End Date</label>
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="form-input"
              />
            </div>
          </div>
        </div>

        {/* Meals List */}
        <div className="space-y-6">
          {meals.length === 0 ? (
            <div className="card text-center py-16">
              <div className="relative">
                <FiCalendar className="h-16 w-16 mx-auto mb-6 text-secondary-300" />
                <div className="absolute inset-0 bg-secondary-300 rounded-full blur opacity-20"></div>
              </div>
              <h3 className="text-xl font-heading font-semibold text-secondary-700 mb-2">No meals found</h3>
              <p className="text-secondary-500 font-body">
                {Object.values(filters).some(v => v) ?
                  'Try adjusting your filters to see more results' :
                  'Start by uploading your first meal to build your history'
                }
              </p>
            </div>
          ) : (
            meals.map((meal) => (
              <div key={meal._id} className="card group hover:shadow-soft-lg transition-all duration-300">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-primary-100 rounded-2xl flex items-center justify-center mr-4">
                        <span className="text-lg">{getMealTypeIcon(meal.mealType)}</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-heading font-semibold text-secondary-800">
                          {meal.name || 'Unnamed Meal'}
                        </h3>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className={`px-3 py-1 text-sm font-heading font-medium rounded-full ${getMealTypeColor(meal.mealType || 'dinner')}`}>
                            {(meal.mealType || 'dinner').charAt(0).toUpperCase() + (meal.mealType || 'dinner').slice(1)}
                          </span>
                          <div className="flex items-center space-x-1 text-sm font-body text-secondary-500">
                            <FiClock className="h-4 w-4" />
                            <span>{new Date(meal.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {meal.imageUrl && (
                      <div className="mb-6">
                        <img
                          src={meal.imageUrl}
                          alt={meal.name}
                          className="w-40 h-32 object-cover rounded-2xl shadow-soft"
                        />
                      </div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                      <div className="text-center p-3 bg-primary-50 rounded-2xl">
                        <div className="text-lg font-heading font-bold text-primary-600">
                          {meal.totalNutrition?.calories || 0}
                        </div>
                        <div className="text-xs font-body text-secondary-600">Calories</div>
                      </div>
                      <div className="text-center p-3 bg-accent-50 rounded-2xl">
                        <div className="text-lg font-heading font-bold text-accent-600">
                          {meal.totalNutrition?.protein || 0}g
                        </div>
                        <div className="text-xs font-body text-secondary-600">Protein</div>
                      </div>
                      <div className="text-center p-3 bg-secondary-50 rounded-2xl">
                        <div className="text-lg font-heading font-bold text-secondary-700">
                          {meal.totalNutrition?.carbs || 0}g
                        </div>
                        <div className="text-xs font-body text-secondary-600">Carbs</div>
                      </div>
                      <div className="text-center p-3 bg-primary-50 rounded-2xl">
                        <div className="text-lg font-heading font-bold text-primary-600">
                          {meal.totalNutrition?.fat || 0}g
                        </div>
                        <div className="text-xs font-body text-secondary-600">Fat</div>
                      </div>
                      <div className="text-center p-3 bg-accent-50 rounded-2xl">
                        <div className="text-lg font-heading font-bold text-accent-600">
                          {meal.totalNutrition?.fiber || 0}g
                        </div>
                        <div className="text-xs font-body text-secondary-600">Fiber</div>
                      </div>
                    </div>

                    {meal.notes && (
                      <div className="p-4 bg-secondary-50 rounded-2xl mb-4">
                        <p className="font-body text-secondary-700">{meal.notes}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <p className="text-sm font-body text-secondary-500">
                        Added {new Date(meal.date).toLocaleDateString()} at{' '}
                        {new Date(meal.date).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-6">
                    <button className="btn-secondary p-3 group-hover:bg-primary-100 group-hover:text-primary-600 transition-colors duration-200">
                      <FiEdit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteMeal(meal._id)}
                      className="btn-secondary p-3 group-hover:bg-red-100 group-hover:text-red-600 transition-colors duration-200"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MealHistory;
