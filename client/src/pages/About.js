import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiHeart, FiUsers, FiArrowLeft, FiActivity, FiStar, FiAward, FiLogIn } from 'react-icons/fi';

const About = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 to-secondary-100">
      {/* Navigation */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-secondary-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-500 rounded-2xl flex items-center justify-center shadow-soft-lg">
                <FiActivity className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-heading font-bold text-secondary-800">
                CalWise
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 text-secondary-600 hover:text-secondary-800 transition-colors duration-200"
                >
                  <FiArrowLeft className="h-5 w-5" />
                  <span className="font-body">Back to Dashboard</span>
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center space-x-2 bg-primary-500 text-white px-4 py-2 rounded-xl font-heading font-medium hover:bg-primary-600 transition-colors duration-200"
                >
                  <FiLogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary-100 rounded-full px-6 py-3 mb-8">
            <FiHeart className="h-5 w-5 text-primary-600" />
            <span className="text-primary-800 font-body font-medium">
              Made with Love & Health in Mind
            </span>
            <FiHeart className="h-5 w-5 text-primary-600" />
          </div>

          <h1 className="text-4xl md:text-5xl font-heading font-bold text-secondary-800 mb-6">
            AI-Powered Calorie Tracker
          </h1>

          <p className="text-xl text-secondary-600 font-body max-w-3xl mx-auto leading-relaxed">
            Freshly cooked by passionate developers to help you stay happy, healthy,
            and full of energy every single day.
          </p>
        </div>

        {/* Developers Section */}
        <div className="card mb-12">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <FiUsers className="h-6 w-6 text-primary-500" />
              <h2 className="text-2xl font-heading font-bold text-secondary-800">
                Meet Our Developers
              </h2>
            </div>
            <p className="text-secondary-600 font-body">
              The amazing team behind CalWise
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Arpit */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 text-center border border-green-200">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-soft-lg">
                <FiHeart className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-heading font-bold text-green-800 mb-2">
                Arpit
              </h3>
              <p className="text-green-700 font-body font-medium mb-4">
                Emp ID: 1121326
              </p>
              <div className="flex items-center justify-center space-x-1">
                <FiStar className="h-4 w-4 text-yellow-500" />
                <FiStar className="h-4 w-4 text-yellow-500" />
                <FiStar className="h-4 w-4 text-yellow-500" />
                <FiStar className="h-4 w-4 text-yellow-500" />
                <FiStar className="h-4 w-4 text-yellow-500" />
              </div>
            </div>

            {/* Krrish */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 text-center border border-blue-200">
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-soft-lg">
                <FiHeart className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-heading font-bold text-blue-800 mb-2">
                Krrish
              </h3>
              <p className="text-blue-700 font-body font-medium mb-4">
                Emp ID: 1246110
              </p>
              <div className="flex items-center justify-center space-x-1">
                <FiStar className="h-4 w-4 text-yellow-500" />
                <FiStar className="h-4 w-4 text-yellow-500" />
                <FiStar className="h-4 w-4 text-yellow-500" />
                <FiStar className="h-4 w-4 text-yellow-500" />
                <FiStar className="h-4 w-4 text-yellow-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="card mb-12">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <FiAward className="h-6 w-6 text-primary-500" />
              <h2 className="text-2xl font-heading font-bold text-secondary-800">
                Our Mission
              </h2>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto">
                <span className="text-2xl">🥗</span>
              </div>
              <h3 className="text-lg font-heading font-semibold text-secondary-800">
                Healthy Living
              </h3>
              <p className="text-secondary-600 font-body text-sm">
                Empowering you to make informed decisions about your nutrition and wellness journey.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-lg font-heading font-semibold text-secondary-800">
                Energy Boost
              </h3>
              <p className="text-secondary-600 font-body text-sm">
                Helping you maintain optimal energy levels throughout your day with smart meal tracking.
              </p>
            </div>

            <div className="space-y-4">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto">
                <span className="text-2xl">😊</span>
              </div>
              <h3 className="text-lg font-heading font-semibold text-secondary-800">
                Happiness
              </h3>
              <p className="text-secondary-600 font-body text-sm">
                Making health tracking enjoyable and rewarding, because a healthy life should be a happy life.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-heading font-bold mb-4">
              Ready to Start Your Journey?
            </h3>
            <p className="text-primary-100 font-body mb-6">
              Join thousands of users who are already living healthier, happier lives with CalWise.
            </p>
            <Link
              to="/dashboard"
              className="inline-flex items-center space-x-2 bg-white text-primary-600 px-8 py-3 rounded-xl font-heading font-semibold hover:bg-primary-50 transition-colors duration-200 shadow-soft-lg"
            >
              <FiActivity className="h-5 w-5" />
              <span>Start Tracking Now</span>
            </Link>
          </div>
        </div>

        {/* Footer Message */}
        <div className="text-center mt-16">
          <p className="text-secondary-500 font-body text-sm">
            Made with 💚 and 💙 by Arpit & Krrish
          </p>
          <p className="text-secondary-400 font-body text-xs mt-2">
            © 2024 CalWise. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
