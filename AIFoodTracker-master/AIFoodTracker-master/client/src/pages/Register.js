import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser, FiActivity, FiArrowRight } from 'react-icons/fi';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    height: '',
    weight: '',
    age: '',
    gender: '',
    activityLevel: 'moderately_active',
    goal: 'maintain_weight'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        profile: {
          height: formData.height ? parseInt(formData.height) : undefined,
          weight: formData.weight ? parseInt(formData.weight) : undefined,
          age: formData.age ? parseInt(formData.age) : undefined,
          gender: formData.gender || undefined,
          activityLevel: formData.activityLevel,
          goal: formData.goal
        }
      };

      const result = await register(userData);

      if (result.success) {
        toast.success('Welcome to CalWise! 🎉 Your account has been created successfully.');
        navigate('/dashboard');
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-secondary-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-16 h-16 bg-primary-500 rounded-3xl flex items-center justify-center shadow-soft-lg">
              <FiActivity className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-heading font-bold text-secondary-800">
              CalWise
            </h1>
          </div>
          <h2 className="text-2xl font-heading font-bold text-secondary-800 mb-2">
            Join CalWise
          </h2>
          <p className="text-secondary-600 font-body">
            Create your account to start your nutrition journey
          </p>
        </div>

        {/* Registration Form */}
        <div className="card mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <label className="form-label">Full Name</label>
                <div className="relative">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="form-input"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Email Address</label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="form-input"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="form-input pr-12"
                    placeholder="Create a password (min 6 characters)"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute top-3 right-4 text-secondary-400 hover:text-secondary-600 transition-colors duration-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="form-label">Confirm Password</label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    className="form-input pr-12"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute top-3 right-4 text-secondary-400 hover:text-secondary-600 transition-colors duration-200"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Physical Information */}
            <div className="border-t border-secondary-200 pt-6">
              <h3 className="text-lg font-heading font-semibold text-secondary-800 mb-4">
                Physical Information (Optional)
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Height (cm)</label>
                    <div className="relative">
                      <input
                        id="height"
                        name="height"
                        type="number"
                        className="form-input"
                        placeholder="170"
                        value={formData.height}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Weight (kg)</label>
                    <div className="relative">
                      <input
                        id="weight"
                        name="weight"
                        type="number"
                        className="form-input"
                        placeholder="70"
                        value={formData.weight}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Age</label>
                    <input
                      id="age"
                      name="age"
                      type="number"
                      className="form-input"
                      placeholder="25"
                      value={formData.age}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="form-label">Gender</label>
                    <select
                      id="gender"
                      name="gender"
                      className="form-input"
                      value={formData.gender}
                      onChange={handleChange}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="form-label">Activity Level</label>
                  <select
                    id="activityLevel"
                    name="activityLevel"
                    className="form-input"
                    value={formData.activityLevel}
                    onChange={handleChange}
                  >
                    <option value="sedentary">Sedentary (little/no exercise)</option>
                    <option value="lightly_active">Lightly Active (light exercise 1-3 days/week)</option>
                    <option value="moderately_active">Moderately Active (moderate exercise 3-5 days/week)</option>
                    <option value="very_active">Very Active (hard exercise 6-7 days/week)</option>
                    <option value="extra_active">Extra Active (very hard exercise & physical job)</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Goal</label>
                  <select
                    id="goal"
                    name="goal"
                    className="form-input"
                    value={formData.goal}
                    onChange={handleChange}
                  >
                    <option value="lose_weight">Lose Weight</option>
                    <option value="maintain_weight">Maintain Weight</option>
                    <option value="gain_weight">Gain Weight</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center space-x-2 group"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <FiArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-secondary-600 font-body">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-heading font-medium text-primary-600 hover:text-primary-500 transition-colors duration-200"
            >
              Sign in here
            </Link>
          </p>
        </div>

        {/* About Link */}
        <div className="text-center mt-4">
          <Link
            to="/about"
            className="text-xs font-body text-secondary-500 hover:text-secondary-700 transition-colors duration-200"
          >
            About CalWise & Our Team
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
