import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FiMail, FiLock, FiEye, FiEyeOff, FiActivity, FiArrowRight } from 'react-icons/fi';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);

      if (result.success) {
        toast.success('Welcome back to CalWise! 🎉');
        navigate(from, { replace: true });
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
      <div className="max-w-md w-full">
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
            Welcome Back
          </h2>
          <p className="text-secondary-600 font-body">
            Sign in to continue your nutrition journey
          </p>
        </div>

        {/* Login Form */}
        <div className="card mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
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
                  autoComplete="current-password"
                  required
                  className="form-input pr-12"
                  placeholder="Enter your password"
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

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-body text-primary-600 hover:text-primary-500 transition-colors duration-200"
                >
                  Forgot password?
                </Link>
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
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <FiArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Register Link */}
        <div className="text-center">
          <p className="text-secondary-600 font-body">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-heading font-medium text-primary-600 hover:text-primary-500 transition-colors duration-200"
            >
              Create one here
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

        {/* Demo Credentials */}
        <div className="mt-8 p-6 bg-primary-50 rounded-2xl border border-primary-100">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
              <FiActivity className="h-3 w-3 text-primary-600" />
            </div>
            <h3 className="text-sm font-heading font-semibold text-primary-800">Demo Account</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-body text-primary-700">Email:</span>
              <span className="text-xs font-body font-medium text-primary-800">demo@example.com</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-body text-primary-700">Password:</span>
              <span className="text-xs font-body font-medium text-primary-800">12356</span>
            </div>
          </div>
          <p className="text-xs font-body text-primary-600 mt-3">
            Use these credentials to explore CalWise features
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
