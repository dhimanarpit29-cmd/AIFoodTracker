import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiCalendar, FiFilter, FiTrash2, FiEdit } from 'react-icons/fi';

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow">
                  <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Meal History</h1>
          <p className="mt-2 text-gray-600">
            View and manage your meal records
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="flex items-center mb-4">
            <FiFilter className="h-5 w-5 text-gray-600 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">Filters</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meal Type
              </label>
              <select
                name="mealType"
                value={filters.mealType}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
                <option value="snack">Snack</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Meals List */}
        <div className="space-y-4">
          {meals.length === 0 ? (
            <div className="bg-white p-12 rounded-lg shadow text-center">
              <FiCalendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No meals found</h3>
              <p className="text-gray-600">
                {Object.values(filters).some(v => v) ?
                  'Try adjusting your filters' :
                  'Start by uploading your first meal'
                }
              </p>
            </div>
          ) : (
            meals.map((meal) => (
              <div key={meal._id} className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        {meal.name}
                      </h3>
                      <span className={`ml-3 px-2 py-1 text-xs rounded-full ${
                        meal.mealType === 'breakfast' ? 'bg-yellow-100 text-yellow-800' :
                        meal.mealType === 'lunch' ? 'bg-green-100 text-green-800' :
                        meal.mealType === 'dinner' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {meal.mealType}
                      </span>
                    </div>

                    {meal.imageUrl && (
                      <img
                        src={meal.imageUrl}
                        alt={meal.name}
                        className="w-32 h-24 object-cover rounded-lg mb-4"
                      />
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Calories:</span>
                        <span className="ml-1 font-medium">{meal.totalNutrition.calories}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Protein:</span>
                        <span className="ml-1 font-medium">{meal.totalNutrition.protein}g</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Carbs:</span>
                        <span className="ml-1 font-medium">{meal.totalNutrition.carbs}g</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Fat:</span>
                        <span className="ml-1 font-medium">{meal.totalNutrition.fat}g</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Fiber:</span>
                        <span className="ml-1 font-medium">{meal.totalNutrition.fiber}g</span>
                      </div>
                    </div>

                    {meal.notes && (
                      <p className="text-sm text-gray-600 mt-2">{meal.notes}</p>
                    )}

                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(meal.date).toLocaleDateString()} at{' '}
                      {new Date(meal.date).toLocaleTimeString()}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button className="text-blue-600 hover:text-blue-800 p-2">
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => deleteMeal(meal._id)}
                      className="text-red-600 hover:text-red-800 p-2"
                    >
                      <FiTrash2 />
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
