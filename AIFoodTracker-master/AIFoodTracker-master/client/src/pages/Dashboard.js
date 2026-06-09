import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  FiCamera,
  FiTrendingUp,
  FiTarget,
  FiCalendar,
  FiActivity,
  FiBarChart,
  FiPlus,
  FiArrowRight
} from 'react-icons/fi';

const Dashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/users/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-secondary-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-12 bg-white rounded-3xl w-1/3 mb-8 shadow-soft"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white p-8 rounded-3xl shadow-soft">
                  <div className="h-6 bg-secondary-200 rounded-2xl w-3/4 mb-4"></div>
                  <div className="h-10 bg-secondary-200 rounded-2xl w-1/2"></div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-3xl shadow-soft">
                <div className="h-8 bg-secondary-200 rounded-2xl w-1/2 mb-6"></div>
                <div className="space-y-4">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="h-12 bg-secondary-100 rounded-2xl"></div>
                  ))}
                </div>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-soft">
                <div className="h-8 bg-secondary-200 rounded-2xl w-1/2 mb-6"></div>
                <div className="h-40 bg-secondary-100 rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { today, weekly, recentMeals } = dashboardData || {};

  const getProgressColor = (progress) => {
    switch (progress) {
      case 'on_track': return 'text-primary-600';
      case 'under': return 'text-accent-600';
      case 'over': return 'text-red-500';
      default: return 'text-secondary-400';
    }
  };

  const getProgressIcon = (progress) => {
    switch (progress) {
      case 'on_track': return '🎯';
      case 'under': return '📉';
      case 'over': return '📈';
      default: return '❓';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-secondary-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-heading font-bold text-secondary-800 mb-2">
                Welcome back, {user?.name}! 👋
              </h1>
              <p className="text-lg font-body text-secondary-600">
                Here's your intelligent nutrition overview for today
              </p>
            </div>
            <div className="hidden md:block">
              <div className="flex items-center space-x-2 bg-white px-6 py-3 rounded-2xl shadow-soft">
                <FiCalendar className="h-5 w-5 text-primary-500" />
                <span className="font-body text-secondary-700">
                  {new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="card group hover:shadow-soft-lg transition-all duration-300">
            <div className="flex items-center">
              <div className="p-4 bg-primary-100 rounded-2xl group-hover:bg-primary-200 transition-colors duration-200">
                <FiCamera className="h-8 w-8 text-primary-600" />
              </div>
              <div className="ml-6">
                <p className="text-sm font-heading font-medium text-secondary-600 mb-1">Today's Meals</p>
                <p className="text-3xl font-heading font-bold text-secondary-800">
                  {today?.meals || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="card group hover:shadow-soft-lg transition-all duration-300">
            <div className="flex items-center">
              <div className="p-4 bg-accent-100 rounded-2xl group-hover:bg-accent-200 transition-colors duration-200">
                <FiActivity className="h-8 w-8 text-accent-600" />
              </div>
              <div className="ml-6">
                <p className="text-sm font-heading font-medium text-secondary-600 mb-1">Calories Today</p>
                <p className="text-3xl font-heading font-bold text-secondary-800">
                  {today?.nutrition?.calories || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="card group hover:shadow-soft-lg transition-all duration-300">
            <div className="flex items-center">
              <div className="p-4 bg-secondary-100 rounded-2xl group-hover:bg-secondary-200 transition-colors duration-200">
                <span className="text-2xl">{getProgressIcon(today?.calorieProgress)}</span>
              </div>
              <div className="ml-6">
                <p className="text-sm font-heading font-medium text-secondary-600 mb-1">Goal Progress</p>
                <p className={`text-3xl font-heading font-bold ${getProgressColor(today?.calorieProgress)}`}>
                  {today?.calorieProgress === 'on_track' ? 'On Track' :
                   today?.calorieProgress === 'under' ? 'Under Goal' :
                   today?.calorieProgress === 'over' ? 'Over Goal' : 'Unknown'}
                </p>
              </div>
            </div>
          </div>

          <div className="card group hover:shadow-soft-lg transition-all duration-300">
            <div className="flex items-center">
              <div className="p-4 bg-primary-100 rounded-2xl group-hover:bg-primary-200 transition-colors duration-200">
                <FiBarChart className="h-8 w-8 text-primary-600" />
              </div>
              <div className="ml-6">
                <p className="text-sm font-heading font-medium text-secondary-600 mb-1">Weekly Avg</p>
                <p className="text-3xl font-heading font-bold text-secondary-800">
                  {weekly?.dailyAverages?.calories || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions & Nutrition Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="card">
            <div className="flex items-center justify-between mb-8">
              <h2 className="card-title">Quick Actions</h2>
              <FiArrowRight className="h-6 w-6 text-secondary-400" />
            </div>
            <div className="space-y-4">
              <button
                onClick={() => window.location.href = '/upload'}
                className="btn-primary w-full flex items-center justify-center space-x-3 group"
              >
                <FiPlus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-200" />
                <span>Upload Meal Photo</span>
              </button>
              <button
                onClick={() => window.location.href = '/analytics'}
                className="btn-secondary w-full flex items-center justify-center space-x-3"
              >
                <FiTrendingUp className="h-5 w-5" />
                <span>View Analytics</span>
              </button>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-8">
              <h2 className="card-title">Today's Nutrition</h2>
              <FiTarget className="h-6 w-6 text-primary-500" />
            </div>
            {today?.nutrition ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center p-4 bg-secondary-50 rounded-2xl">
                  <span className="font-body text-secondary-700">Calories</span>
                  <span className="font-heading font-bold text-lg text-secondary-800">
                    {today.nutrition.calories} / {dashboardData?.user?.dailyCalories || 'N/A'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-primary-50 rounded-2xl">
                    <p className="text-2xl font-heading font-bold text-primary-600">{today.nutrition.protein}g</p>
                    <p className="text-sm font-body text-secondary-600">Protein</p>
                  </div>
                  <div className="text-center p-4 bg-accent-50 rounded-2xl">
                    <p className="text-2xl font-heading font-bold text-accent-600">{today.nutrition.carbs}g</p>
                    <p className="text-sm font-body text-secondary-600">Carbs</p>
                  </div>
                  <div className="text-center p-4 bg-secondary-50 rounded-2xl">
                    <p className="text-2xl font-heading font-bold text-secondary-700">{today.nutrition.fat}g</p>
                    <p className="text-sm font-body text-secondary-600">Fat</p>
                  </div>
                  <div className="text-center p-4 bg-primary-50 rounded-2xl">
                    <p className="text-2xl font-heading font-bold text-primary-600">{today.nutrition.fiber}g</p>
                    <p className="text-sm font-body text-secondary-600">Fiber</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <FiCamera className="h-16 w-16 text-secondary-300 mx-auto mb-4" />
                <p className="font-body text-secondary-500 mb-4">No meals logged today</p>
                <button
                  onClick={() => window.location.href = '/upload'}
                  className="btn-primary"
                >
                  Log Your First Meal
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Recent Meals */}
        <div className="card">
          <div className="flex items-center justify-between mb-8">
            <h2 className="card-title">Recent Meals</h2>
            <button
              onClick={() => window.location.href = '/history'}
              className="btn-ghost flex items-center space-x-2"
            >
              <span>View All</span>
              <FiArrowRight className="h-4 w-4" />
            </button>
          </div>
          {recentMeals && recentMeals.length > 0 ? (
            <div className="space-y-4">
              {recentMeals.slice(0, 5).map((meal) => (
                <div key={meal.id} className="flex items-center justify-between p-6 bg-secondary-50 rounded-2xl hover:bg-secondary-100 transition-colors duration-200">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-2xl flex items-center justify-center">
                      <FiActivity className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-secondary-800">{meal.name}</h3>
                      <p className="text-sm font-body text-secondary-600 capitalize">{meal.mealType}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-heading font-bold text-lg text-secondary-800">{meal.calories} cal</p>
                    <p className="text-sm font-body text-secondary-500">
                      {new Date(meal.time).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FiBarChart className="h-16 w-16 text-secondary-300 mx-auto mb-4" />
              <p className="font-body text-secondary-500">No recent meals found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
